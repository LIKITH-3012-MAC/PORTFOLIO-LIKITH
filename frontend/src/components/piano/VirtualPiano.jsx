import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Keyboard,
  Disc,
  RotateCcw,
} from 'lucide-react';
import { fadeUp } from '../../motion/variants';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const KEYBOARD_BINDINGS = [
  // Lower octave (0..11)
  { code: 'KeyZ', label: 'Z' },
  { code: 'KeyS', label: 'S' },
  { code: 'KeyX', label: 'X' },
  { code: 'KeyD', label: 'D' },
  { code: 'KeyC', label: 'C' },
  { code: 'KeyV', label: 'V' },
  { code: 'KeyG', label: 'G' },
  { code: 'KeyB', label: 'B' },
  { code: 'KeyH', label: 'H' },
  { code: 'KeyN', label: 'N' },
  { code: 'KeyJ', label: 'J' },
  { code: 'KeyM', label: 'M' },
  // Upper octave + top C (12..24)
  { code: 'KeyQ', label: 'Q' },
  { code: 'Digit2', label: '2' },
  { code: 'KeyW', label: 'W' },
  { code: 'Digit3', label: '3' },
  { code: 'KeyE', label: 'E' },
  { code: 'KeyR', label: 'R' },
  { code: 'Digit5', label: '5' },
  { code: 'KeyT', label: 'T' },
  { code: 'Digit6', label: '6' },
  { code: 'KeyY', label: 'Y' },
  { code: 'Digit7', label: '7' },
  { code: 'KeyU', label: 'U' },
  { code: 'KeyI', label: 'I' },
];

// Accurate black key horizontal position offsets (in white-key-width units)
const BLACK_KEY_OFFSETS = {
  1: 0.68,  // C#
  3: 1.72,  // D#
  6: 3.66,  // F#
  8: 4.69,  // G#
  10: 5.73, // A#
};

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function detectChord(noteFullNames) {
  if (!noteFullNames || noteFullNames.length < 3) return null;
  const pitchClasses = Array.from(
    new Set(
      noteFullNames.map((name) => {
        const match = name.match(/^([A-G]#?)/);
        return match ? NOTE_NAMES.indexOf(match[1]) : -1;
      }).filter((n) => n >= 0)
    )
  );

  if (pitchClasses.length < 3) return null;

  const patterns = [
    { name: 'Major', intervals: [0, 4, 7] },
    { name: 'Minor', intervals: [0, 3, 7] },
    { name: 'Maj7', intervals: [0, 4, 7, 11] },
    { name: 'Min7', intervals: [0, 3, 7, 10] },
    { name: '7', intervals: [0, 4, 7, 10] },
    { name: 'Sus2', intervals: [0, 2, 7] },
    { name: 'Sus4', intervals: [0, 5, 7] },
    { name: 'Dim', intervals: [0, 3, 6] },
  ];

  for (const root of pitchClasses) {
    const normalized = pitchClasses.map((pc) => (pc - root + 12) % 12);
    for (const pattern of patterns) {
      if (
        pattern.intervals.length === normalized.length &&
        pattern.intervals.every((iv) => normalized.includes(iv))
      ) {
        return `${NOTE_NAMES[root]} ${pattern.name}`;
      }
    }
  }
  return null;
}

export const VirtualPiano = () => {
  const [baseOctave, setBaseOctave] = useState(3);
  const [volume, setVolume] = useState(0.78);
  const [isMuted, setIsMuted] = useState(false);
  const [sustainLocked, setSustainLocked] = useState(false);
  const [sustainPedalHeld, setSustainPedalHeld] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [heldNotes, setHeldNotes] = useState([]);
  const [soundingNotes, setSoundingNotes] = useState([]);
  const [spectrumBars, setSpectrumBars] = useState(() => Array(20).fill(0.08));
  const [audioReady, setAudioReady] = useState(false);

  const isSustainActive = sustainLocked || sustainPedalHeld;
  const sustainLockedRef = useRef(false);
  const sustainPedalHeldRef = useRef(false);
  const isSustainActiveRef = useRef(false);

  const toggleSustainLock = useCallback(() => {
    const next = !sustainLockedRef.current;
    sustainLockedRef.current = next;
    isSustainActiveRef.current = next || sustainPedalHeldRef.current;
    setSustainLocked(next);
  }, []);

  // Web Audio refs
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const compressorRef = useRef(null);
  const analyserRef = useRef(null);

  // Polyphonic voice & input state refs
  const activeVoicesRef = useRef(new Map());
  const activePointersRef = useRef(new Map());
  const activeKeyboardRef = useRef(new Map());
  const sustainedNotesRef = useRef(new Set());
  const spectrumRafRef = useRef(null);

  // Build 25-key (2 full octaves + upper C) keyboard layout
  const keys = useMemo(() => {
    const baseMidi = (baseOctave + 1) * 12; // C3 = 48
    return KEYBOARD_BINDINGS.map((binding, idx) => {
      const midi = baseMidi + idx;
      const semitone = midi % 12;
      const noteName = NOTE_NAMES[semitone];
      const octave = Math.floor(midi / 12) - 1;
      const fullName = `${noteName}${octave}`;
      const isBlack = noteName.includes('#');
      const octaveOffset = Math.floor(idx / 12);

      return {
        index: idx,
        midi,
        semitone,
        noteName,
        octave,
        fullName,
        isBlack,
        freq: midiToFreq(midi),
        code: binding.code,
        keyHint: binding.label,
        octaveOffset,
      };
    });
  }, [baseOctave]);

  const whiteKeys = useMemo(() => keys.filter((k) => !k.isBlack), [keys]);
  const blackKeys = useMemo(() => keys.filter((k) => k.isBlack), [keys]);
  const keyByCode = useMemo(() => {
    const map = new Map();
    keys.forEach((k) => map.set(k.code, k));
    return map;
  }, [keys]);
  const keyByName = useMemo(() => {
    const map = new Map();
    keys.forEach((k) => map.set(k.fullName, k));
    return map;
  }, [keys]);

  const syncVisualNoteState = useCallback(() => {
    const heldSet = new Set([
      ...activePointersRef.current.values(),
      ...activeKeyboardRef.current.values(),
    ]);
    const soundSet = new Set([...heldSet, ...sustainedNotesRef.current]);
    setHeldNotes(Array.from(heldSet));
    setSoundingNotes(Array.from(soundSet));
  }, []);

  const ensureAudioEngine = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const ctx = new AudioCtx();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, ctx.currentTime);
      compressor.knee.setValueAtTime(18, ctx.currentTime);
      compressor.ratio.setValueAtTime(4, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.15, ctx.currentTime);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.78;

      compressor.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      compressorRef.current = compressor;
      masterGainRef.current = masterGain;
      analyserRef.current = analyser;
      setAudioReady(true);
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    return audioCtxRef.current;
  }, [isMuted, volume]);

  // Smooth master volume updates
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (ctx && masterGain && ctx.state !== 'closed') {
      const target = isMuted ? 0 : volume;
      masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.02);
    }
  }, [volume, isMuted]);

  const stopVoiceImmediate = useCallback((noteName, releaseDuration = 0.25) => {
    const voice = activeVoicesRef.current.get(noteName);
    const ctx = audioCtxRef.current;
    if (!voice || !ctx || ctx.state === 'closed') {
      activeVoicesRef.current.delete(noteName);
      return;
    }

    if (voice.cleanupTimer) {
      clearTimeout(voice.cleanupTimer);
    }

    const now = ctx.currentTime;
    try {
      voice.envGain.gain.cancelScheduledValues(now);
      const currentGain = Math.max(voice.envGain.gain.value, 0.0001);
      voice.envGain.gain.setValueAtTime(currentGain, now);
      voice.envGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseDuration);

      const stopAt = now + releaseDuration + 0.03;
      voice.oscillators.forEach((osc) => {
        try {
          osc.stop(stopAt);
        } catch {}
      });

      voice.cleanupTimer = setTimeout(() => {
        try {
          voice.oscillators.forEach((osc) => osc.disconnect());
          voice.filter.disconnect();
          voice.envGain.disconnect();
        } catch {}
        if (activeVoicesRef.current.get(noteName) === voice) {
          activeVoicesRef.current.delete(noteName);
        }
      }, (releaseDuration + 0.08) * 1000);
    } catch {
      activeVoicesRef.current.delete(noteName);
    }

    activeVoicesRef.current.delete(noteName);
  }, []);

  const startVoice = useCallback(
    (keyObj) => {
      const ctx = ensureAudioEngine();
      if (!ctx || !compressorRef.current) return;

      // Cleanly fade previous voice on retrigger of the same note
      if (activeVoicesRef.current.has(keyObj.fullName)) {
        stopVoiceImmediate(keyObj.fullName, 0.03);
      }
      sustainedNotesRef.current.delete(keyObj.fullName);

      const now = ctx.currentTime;
      const envGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(0.9, now);

      const startCutoff = Math.min(keyObj.freq * 7, 9200);
      const settleCutoff = Math.max(keyObj.freq * 2.1, 520);
      filter.frequency.setValueAtTime(startCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(settleCutoff, now + 0.65);

      // Multi-oscillator grand-piano-inspired voicing
      const oscFund = ctx.createOscillator();
      oscFund.type = 'triangle';
      oscFund.frequency.setValueAtTime(keyObj.freq, now);
      const gainFund = ctx.createGain();
      gainFund.gain.setValueAtTime(0.56, now);

      const oscSecond = ctx.createOscillator();
      oscSecond.type = 'sine';
      oscSecond.frequency.setValueAtTime(keyObj.freq * 2, now);
      const gainSecond = ctx.createGain();
      gainSecond.gain.setValueAtTime(0.24, now);

      const oscThird = ctx.createOscillator();
      oscThird.type = 'sine';
      oscThird.frequency.setValueAtTime(keyObj.freq * 3, now);
      const gainThird = ctx.createGain();
      gainThird.gain.setValueAtTime(0.08, now);

      const oscDetune = ctx.createOscillator();
      oscDetune.type = 'sine';
      oscDetune.frequency.setValueAtTime(keyObj.freq * 1.0016, now);
      const gainDetune = ctx.createGain();
      gainDetune.gain.setValueAtTime(0.18, now);

      // Hammer attack + natural acoustic string decay
      envGain.gain.setValueAtTime(0.0001, now);
      envGain.gain.linearRampToValueAtTime(0.58, now + 0.008);
      envGain.gain.exponentialRampToValueAtTime(0.32, now + 0.28);
      envGain.gain.exponentialRampToValueAtTime(0.07, now + 3.8);

      oscFund.connect(gainFund);
      oscSecond.connect(gainSecond);
      oscThird.connect(gainThird);
      oscDetune.connect(gainDetune);

      gainFund.connect(filter);
      gainSecond.connect(filter);
      gainThird.connect(filter);
      gainDetune.connect(filter);

      filter.connect(envGain);
      envGain.connect(compressorRef.current);

      const oscillators = [oscFund, oscSecond, oscThird, oscDetune];
      oscillators.forEach((osc) => osc.start(now));

      activeVoicesRef.current.set(keyObj.fullName, {
        oscillators,
        filter,
        envGain,
        cleanupTimer: null,
      });
    },
    [ensureAudioEngine, stopVoiceImmediate]
  );

  const isNotePhysicallyHeld = useCallback((noteName) => {
    for (const n of activePointersRef.current.values()) {
      if (n === noteName) return true;
    }
    for (const n of activeKeyboardRef.current.values()) {
      if (n === noteName) return true;
    }
    return false;
  }, []);

  const releaseNoteIfUnheld = useCallback(
    (noteName) => {
      if (isNotePhysicallyHeld(noteName)) {
        syncVisualNoteState();
        return;
      }

      if (isSustainActiveRef.current) {
        sustainedNotesRef.current.add(noteName);
      } else {
        sustainedNotesRef.current.delete(noteName);
        stopVoiceImmediate(noteName, 0.26);
      }
      syncVisualNoteState();
    },
    [isNotePhysicallyHeld, stopVoiceImmediate, syncVisualNoteState]
  );

  const releaseAllNotes = useCallback(() => {
    activePointersRef.current.clear();
    activeKeyboardRef.current.clear();
    sustainedNotesRef.current.clear();
    Array.from(activeVoicesRef.current.keys()).forEach((noteName) => {
      stopVoiceImmediate(noteName, 0.18);
    });
    syncVisualNoteState();
  }, [stopVoiceImmediate, syncVisualNoteState]);

  // Release sustained notes when sustain pedal lifts
  useEffect(() => {
    if (!isSustainActive && sustainedNotesRef.current.size > 0) {
      const toRelease = Array.from(sustainedNotesRef.current);
      sustainedNotesRef.current.clear();
      toRelease.forEach((noteName) => {
        if (!isNotePhysicallyHeld(noteName)) {
          stopVoiceImmediate(noteName, 0.28);
        }
      });
      syncVisualNoteState();
    }
  }, [isSustainActive, isNotePhysicallyHeld, stopVoiceImmediate, syncVisualNoteState]);

  // Computer keyboard support (works cleanly alongside chords & Shift sustain)
  useEffect(() => {
    const isTypingTarget = (target) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    };

    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(document.activeElement) || isTypingTarget(e.target)) return;

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        sustainPedalHeldRef.current = true;
        isSustainActiveRef.current = true;
        setSustainPedalHeld(true);
        return;
      }

      const keyObj = keyByCode.get(e.code);
      if (!keyObj) return;
      if (e.repeat || activeKeyboardRef.current.has(e.code)) return;

      e.preventDefault();
      activeKeyboardRef.current.set(e.code, keyObj.fullName);
      startVoice(keyObj);
      syncVisualNoteState();
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        sustainPedalHeldRef.current = false;
        isSustainActiveRef.current = sustainLockedRef.current;
        setSustainPedalHeld(false);
        return;
      }

      const noteName = activeKeyboardRef.current.get(e.code);
      if (!noteName) return;

      activeKeyboardRef.current.delete(e.code);
      releaseNoteIfUnheld(noteName);
    };

    const handleWindowBlur = () => {
      sustainPedalHeldRef.current = false;
      isSustainActiveRef.current = sustainLockedRef.current;
      setSustainPedalHeld(false);
      releaseAllNotes();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [keyByCode, startVoice, releaseNoteIfUnheld, releaseAllNotes, syncVisualNoteState]);

  // Live Web Audio frequency spectrum visualizer
  useEffect(() => {
    const updateSpectrum = () => {
      const analyser = analyserRef.current;
      if (analyser && audioCtxRef.current?.state === 'running') {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const bars = Array.from({ length: 20 }, (_, i) => {
          const val = data[i] || 0;
          return Math.max(0.08, Math.min(1, val / 210));
        });
        setSpectrumBars(bars);
      }
      spectrumRafRef.current = requestAnimationFrame(updateSpectrum);
    };

    spectrumRafRef.current = requestAnimationFrame(updateSpectrum);
    return () => {
      if (spectrumRafRef.current) {
        cancelAnimationFrame(spectrumRafRef.current);
      }
    };
  }, []);

  // Cleanup Web Audio context & voices on unmount
  useEffect(() => {
    return () => {
      Array.from(activeVoicesRef.current.values()).forEach((voice) => {
        if (voice.cleanupTimer) clearTimeout(voice.cleanupTimer);
        voice.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
      });
      activeVoicesRef.current.clear();

      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Pointer handlers supporting mouse, glissando, and multi-touch chords
  const handleKeyPointerDown = (e, keyObj) => {
    e.preventDefault();
    e.stopPropagation();
    activePointersRef.current.set(e.pointerId, keyObj.fullName);
    startVoice(keyObj);
    syncVisualNoteState();
  };

  const handleKeyPointerEnter = (e, keyObj) => {
    // Support smooth mouse/stylus glissando when primary button is held
    if (e.buttons !== 1) return;
    const prevNote = activePointersRef.current.get(e.pointerId);
    if (prevNote === keyObj.fullName) return;

    activePointersRef.current.set(e.pointerId, keyObj.fullName);
    if (prevNote) {
      releaseNoteIfUnheld(prevNote);
    }
    startVoice(keyObj);
    syncVisualNoteState();
  };

  const handleKeyPointerUpOrLeave = (e, keyObj) => {
    const trackedNote = activePointersRef.current.get(e.pointerId);
    if (!trackedNote) return;
    if (trackedNote !== keyObj.fullName) return;

    activePointersRef.current.delete(e.pointerId);
    releaseNoteIfUnheld(trackedNote);
  };

  const handleOctaveChange = (delta) => {
    releaseAllNotes();
    setBaseOctave((prev) => Math.max(2, Math.min(5, prev + delta)));
  };

  const detectedChord = useMemo(() => detectChord(soundingNotes), [soundingNotes]);
  const whiteCount = whiteKeys.length; // 15

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="relative rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl p-5 sm:p-8 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.75)] text-left"
    >
      {/* Subtle overhead stage light */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-48 rounded-full bg-gradient-to-r from-blue-500/15 via-amber-400/15 to-purple-500/15 blur-3xl" />

      {/* Studio Console Header & Controls */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-mono uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3 h-3" />
              Polyphonic Web Audio Synth
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-300">
              2 Octaves • 25 Keys
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest ${
                audioReady
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-blue-500/10 border-blue-500/25 text-blue-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${audioReady ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`} />
              {audioReady ? 'Audio Engine Active' : 'Press Any Key to Play'}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Interactive Virtual Piano
          </h3>

          {/* Live Readout + Spectrum */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="min-h-[30px] px-3 py-1 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 uppercase text-[10px]">Sounding:</span>
              {soundingNotes.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {soundingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold"
                    >
                      {note}
                    </span>
                  ))}
                  {detectedChord && (
                    <span className="ml-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px]">
                      {detectedChord}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-slate-500 text-[11px]">Ready — click, touch, or use keyboard</span>
              )}
            </div>

            {/* Live frequency bars */}
            <div
              aria-hidden="true"
              className="h-[30px] w-32 px-2.5 rounded-xl bg-black/50 border border-white/10 flex items-end gap-1 py-1.5"
            >
              {spectrumBars.map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-full transition-[height] duration-75"
                  style={{
                    height: `${Math.round(bar * 100)}%`,
                    background:
                      idx % 2 === 0
                        ? 'rgba(251, 191, 36, 0.85)'
                        : 'rgba(96, 165, 250, 0.85)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Studio Control Rack */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Octave Selector */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-full p-1">
            <button
              type="button"
              onClick={() => handleOctaveChange(-1)}
              disabled={baseOctave <= 2}
              aria-label="Decrease octave"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2 text-center">
              <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 leading-none">
                Range
              </div>
              <div className="text-xs font-mono font-semibold text-white mt-0.5">
                C{baseOctave} – C{baseOctave + 2}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOctaveChange(1)}
              disabled={baseOctave >= 5}
              aria-label="Increase octave"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sustain Pedal */}
          <button
            type="button"
            onClick={toggleSustainLock}
            aria-label="Toggle sustain pedal"
            aria-pressed={isSustainActive}
            className={`px-4 h-10 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${
              isSustainActive
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Disc className={`w-3.5 h-3.5 ${isSustainActive ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>Sustain: {isSustainActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Key Labels Toggle */}
          <button
            type="button"
            onClick={() => setShowLabels((l) => !l)}
            aria-label="Toggle key labels"
            aria-pressed={showLabels}
            className={`px-3.5 h-10 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              showLabels
                ? 'bg-blue-500/15 border-blue-400/40 text-blue-200'
                : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Labels</span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-full px-3.5 h-10">
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? 'Unmute piano' : 'Mute piano'}
              className="text-slate-300 hover:text-amber-400 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (v > 0 && isMuted) setIsMuted(false);
              }}
              aria-label="Piano volume"
              className="w-20 sm:w-24 accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* All Notes Off */}
          <button
            type="button"
            onClick={releaseAllNotes}
            title="Stop all sounding notes"
            aria-label="Reset sounding notes"
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Piano Keybed */}
      <div className="relative z-10 mt-6 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#0b0d14] via-[#07090f] to-[#040508] p-3 sm:p-4 shadow-inner">
        {/* Top felt trim rail */}
        <div className="h-2 w-full rounded-t-lg bg-gradient-to-r from-amber-900/40 via-rose-900/50 to-amber-900/40 border-b border-amber-400/20 mb-0.5" />

        {/* Horizontally scrollable on very narrow mobile screens so keys remain playable */}
        <div className="overflow-x-auto pb-1 custom-scrollbar">
          <div
            className="relative select-none mx-auto"
            style={{ minWidth: '660px', height: '240px', touchAction: 'none' }}
          >
            {/* White Keys Layer */}
            <div className="grid w-full h-full gap-[2px]" style={{ gridTemplateColumns: `repeat(${whiteCount}, minmax(0, 1fr))` }}>
              {whiteKeys.map((keyObj) => {
                const isPressed = heldNotes.includes(keyObj.fullName);
                const isSounding = soundingNotes.includes(keyObj.fullName);
                return (
                  <button
                    key={keyObj.fullName}
                    type="button"
                    data-note={keyObj.fullName}
                    data-key-type="white"
                    aria-label={`Piano key ${keyObj.fullName}`}
                    aria-pressed={isPressed}
                    onPointerDown={(e) => handleKeyPointerDown(e, keyObj)}
                    onPointerEnter={(e) => handleKeyPointerEnter(e, keyObj)}
                    onPointerUp={(e) => handleKeyPointerUpOrLeave(e, keyObj)}
                    onPointerLeave={(e) => handleKeyPointerUpOrLeave(e, keyObj)}
                    onPointerCancel={(e) => handleKeyPointerUpOrLeave(e, keyObj)}
                    className={`relative h-full rounded-b-xl border transition-all duration-75 flex flex-col justify-end items-center pb-3 cursor-pointer select-none focus:outline-none ${
                      isPressed
                        ? 'bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 border-amber-400 translate-y-[3px] shadow-[inset_0_4px_12px_rgba(245,158,11,0.35),0_0_20px_rgba(251,191,36,0.35)]'
                        : isSounding
                        ? 'bg-gradient-to-b from-slate-50 via-amber-50 to-amber-100/90 border-amber-300/70 shadow-[0_6px_14px_rgba(0,0,0,0.45)]'
                        : 'bg-gradient-to-b from-white via-slate-100 to-slate-200 border-slate-300/80 shadow-[0_8px_14px_rgba(0,0,0,0.5),inset_0_-4px_6px_rgba(0,0,0,0.08)] hover:from-white hover:to-amber-50/70'
                    }`}
                    style={{ touchAction: 'none' }}
                  >
                    {showLabels && (
                      <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                        <span className="text-[10px] font-mono font-bold text-slate-600">
                          {keyObj.keyHint}
                        </span>
                        <span
                          className={`text-[11px] font-display font-bold ${
                            isPressed || isSounding ? 'text-amber-700' : 'text-slate-900'
                          }`}
                        >
                          {keyObj.fullName}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Black Keys Layer */}
            {blackKeys.map((keyObj) => {
              const isPressed = heldNotes.includes(keyObj.fullName);
              const isSounding = soundingNotes.includes(keyObj.fullName);
              const baseOffset = BLACK_KEY_OFFSETS[keyObj.semitone] ?? 0;
              const totalWhiteOffset = keyObj.octaveOffset * 7 + baseOffset;
              const leftPercent = (totalWhiteOffset / whiteCount) * 100;
              const widthPercent = (0.62 / whiteCount) * 100;

              return (
                <button
                  key={keyObj.fullName}
                  type="button"
                  data-note={keyObj.fullName}
                  data-key-type="black"
                  aria-label={`Piano key ${keyObj.fullName}`}
                  aria-pressed={isPressed}
                  onPointerDown={(e) => handleKeyPointerDown(e, keyObj)}
                  onPointerEnter={(e) => handleKeyPointerEnter(e, keyObj)}
                  onPointerUp={(e) => handleKeyPointerUpOrLeave(e, keyObj)}
                  onPointerLeave={(e) => handleKeyPointerUpOrLeave(e, keyObj)}
                  onPointerCancel={(e) => handleKeyPointerUpOrLeave(e, keyObj)}
                  className={`absolute top-0 z-20 rounded-b-lg border transition-all duration-75 flex flex-col justify-end items-center pb-2.5 cursor-pointer select-none focus:outline-none ${
                    isPressed
                      ? 'bg-gradient-to-b from-amber-500/80 via-slate-900 to-slate-950 border-amber-400 translate-y-[2px] shadow-[0_0_18px_rgba(251,191,36,0.5),inset_0_2px_6px_rgba(251,191,36,0.4)]'
                      : isSounding
                      ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-amber-400/60 shadow-[0_6px_12px_rgba(0,0,0,0.8)]'
                      : 'bg-gradient-to-b from-slate-800 via-slate-950 to-black border-slate-700/80 shadow-[0_8px_14px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:from-slate-700'
                  }`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    height: '62%',
                    touchAction: 'none',
                  }}
                >
                  {showLabels && (
                    <div className="flex flex-col items-center gap-0.5 pointer-events-none">
                      <span className="text-[9px] font-mono text-amber-300/90 font-semibold">
                        {keyObj.keyHint}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {keyObj.noteName}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Footer Hint */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div>
          <span className="text-amber-400">Lower Octave:</span> Z–M (white) &amp; S, D, G, H, J (black)
          <span className="mx-2 text-slate-600">•</span>
          <span className="text-blue-400">Upper Octave:</span> Q–I (white) &amp; 2, 3, 5, 6, 7 (black)
        </div>
        <div>
          <span className="text-purple-300">Hold Shift:</span> Momentary Sustain Pedal
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualPiano;
