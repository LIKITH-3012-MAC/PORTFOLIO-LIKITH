import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Disc3,
  Music2,
  Radio,
} from 'lucide-react';
import { authorizedTracks } from '../../data/pianoLinks';
import { fadeUp } from '../../motion/variants';

const VISUALIZER_BAR_WEIGHTS = [
  0.35, 0.58, 0.82, 0.45, 0.94, 0.68, 0.52, 0.88,
  0.41, 0.76, 0.63, 0.96, 0.55, 0.72, 0.48, 0.84,
  0.61, 0.39, 0.78, 0.52,
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const MusicPlayer = ({ tracks = authorizedTracks }) => {
  const hasTracks = Array.isArray(tracks) && tracks.length > 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [barLevels, setBarLevels] = useState(() => VISUALIZER_BAR_WEIGHTS.map(() => 0.14));

  const audioRef = useRef(null);
  const animFrameRef = useRef(null);

  const currentTrack = hasTracks ? tracks[currentIndex] || tracks[0] : null;

  // Synchronize audio element volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Reset playback state when track index changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setLoadError('');
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;

    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentIndex, currentTrack?.audioUrl]);

  // Animate visualizer strictly while an authorized track is actively playing
  useEffect(() => {
    if (!isPlaying || !hasTracks) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setBarLevels(VISUALIZER_BAR_WEIGHTS.map(() => 0.14));
      return;
    }

    let start = performance.now();
    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      setBarLevels(
        VISUALIZER_BAR_WEIGHTS.map((weight, idx) => {
          const wave = Math.sin(elapsed * (3.4 + (idx % 5) * 0.45) + idx * 0.7);
          return Math.max(0.18, Math.min(1, weight * (0.62 + 0.38 * wave)));
        })
      );
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, hasTracks]);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!hasTracks || !currentTrack?.audioUrl || !audioRef.current) return;
    setLoadError('');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setLoadError('Unable to play the configured audio source.');
        });
    }
  }, [hasTracks, currentTrack, isPlaying]);

  const handlePrev = useCallback(() => {
    if (!hasTracks) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [hasTracks, tracks.length]);

  const handleNext = useCallback(() => {
    if (!hasTracks) return;
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  }, [hasTracks, tracks.length]);

  const handleSeek = (e) => {
    if (!hasTracks || !audioRef.current || !duration) return;
    const nextTime = Number(e.target.value);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="relative rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl p-6 sm:p-8 md:p-10 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65)] text-left"
    >
      {/* Ambient studio glow */}
      <div className="pointer-events-none absolute -top-28 left-1/3 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Hidden HTMLAudioElement for legitimate authorized tracks */}
      {hasTracks && currentTrack?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          preload="metadata"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onEnded={() => {
            if (tracks.length > 1) {
              handleNext();
            } else {
              setIsPlaying(false);
              setCurrentTime(0);
            }
          }}
          onError={() => {
            setIsPlaying(false);
            setLoadError('Audio source could not be loaded.');
          }}
        />
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Album Artwork */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#0a0f22] to-slate-950 overflow-hidden flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            {currentTrack?.artworkUrl ? (
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_70%)]" />
                <div
                  className={`w-24 h-24 rounded-full border border-amber-500/30 bg-slate-950/90 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.15)] ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                >
                  <Disc3 className="w-11 h-11 text-amber-400/90" />
                </div>
                <span className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400">
                  Studio Deck
                </span>
              </div>
            )}

            {/* Status chip */}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-slate-300">
              <Radio className={`w-2.5 h-2.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              {isPlaying ? 'Playing' : hasTracks ? 'Ready' : 'Standby'}
            </div>
          </div>
        </div>

        {/* Track Info, Visualizer, Progress & Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
                <Music2 className="w-3.5 h-3.5" />
                Studio Audio Player
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {currentTrack?.title || 'No Audio Source Configured Yet'}
              </h3>
              <p className="text-sm text-slate-400 font-light">
                {currentTrack?.artist
                  ? `${currentTrack.artist} • Studio Recording`
                  : 'Authorized studio recordings will appear here once added to frontend/src/data/pianoLinks.js.'}
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400 shrink-0">
              {formatTime(currentTime)} / {currentTrack?.duration || formatTime(duration)}
            </div>
          </div>

          {/* Animated Audio Visualizer */}
          <div
            aria-label="Audio visualizer"
            className="h-16 px-4 rounded-2xl bg-black/35 border border-white/10 flex items-end justify-between gap-1.5 py-3 overflow-hidden"
          >
            {barLevels.map((level, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-full transition-[height,opacity] duration-150 ease-out"
                style={{
                  height: `${Math.round(level * 100)}%`,
                  opacity: isPlaying ? 0.95 : 0.25,
                  background:
                    idx % 3 === 0
                      ? 'linear-gradient(to top, rgba(251,191,36,0.7), rgba(253,230,138,0.95))'
                      : idx % 3 === 1
                      ? 'linear-gradient(to top, rgba(59,130,246,0.6), rgba(147,197,253,0.9))'
                      : 'linear-gradient(to top, rgba(139,92,246,0.6), rgba(196,181,253,0.9))',
                }}
              />
            ))}
          </div>

          {/* Empty state / Error notice */}
          {!hasTracks && (
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-amber-500/20 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span>
                Studio deck is in clean standby mode. No audio files have been configured yet — use the playable Virtual Piano above or follow <span className="text-amber-400 font-medium">@pianopeaceby_lee</span>.
              </span>
            </div>
          )}
          {loadError && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300">
              {loadError}
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400 transition-[width] duration-150"
                style={{ width: `${progressPct}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                disabled={!hasTracks || duration <= 0}
                onChange={handleSeek}
                aria-label="Track progress"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Playback Controls & Volume */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!hasTracks}
                aria-label="Previous track"
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-200 hover:bg-white/10 hover:border-amber-400/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                disabled={!hasTracks}
                aria-label={isPlaying ? 'Pause track' : 'Play track'}
                className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:bg-white/10 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!hasTracks}
                aria-label="Next track"
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-200 hover:bg-white/10 hover:border-amber-400/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2">
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? 'Unmute player' : 'Mute player'}
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
                aria-label="Player volume"
                className="w-24 sm:w-28 accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
