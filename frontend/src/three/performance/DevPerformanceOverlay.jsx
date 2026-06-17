import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export const DevPerformanceOverlay = ({ quality }) => {
  const { gl } = useThree();
  const [metrics, setMetrics] = useState({
    fps: 0,
    avgFrameTime: 0,
    p95FrameTime: 0,
    variance: 0,
    longFrames: 0,
    drawCalls: 0,
    triangles: 0,
    textures: 0,
    programs: 0,
    dpr: 1
  });

  const frameTimesRef = useRef([]);
  const lastTimeRef = useRef(performance.now());
  const longFramesCountRef = useRef(0);
  const sampleTimerRef = useRef(0);
  const frameCounterRef = useRef(0);

  useFrame((state, delta) => {
    const now = performance.now();
    const frameTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Track frame time in sliding window of 100 frames
    const fTimes = frameTimesRef.current;
    fTimes.push(frameTime);
    if (fTimes.length > 100) {
      fTimes.shift();
    }

    // A long frame is defined as taking longer than 17.5ms (or exceeding the current display timing)
    if (frameTime > 17.5) {
      longFramesCountRef.current++;
    }

    frameCounterRef.current++;
    sampleTimerRef.current += delta;

    // Update metrics state every 500ms for stable readability
    if (sampleTimerRef.current >= 0.5) {
      const elapsed = sampleTimerRef.current * 1000;
      const currentFps = Math.round((frameCounterRef.current * 1000) / elapsed);

      // Average frame time
      const sum = fTimes.reduce((acc, val) => acc + val, 0);
      const avg = fTimes.length > 0 ? sum / fTimes.length : 0;

      // 95th Percentile
      const sorted = [...fTimes].sort((a, b) => a - b);
      const p95Idx = Math.floor(sorted.length * 0.95);
      const p95 = sorted.length > 0 ? sorted[p95Idx] : 0;

      // Frame time variance
      const mean = avg;
      const varianceSum = fTimes.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
      const variance = fTimes.length > 0 ? varianceSum / fTimes.length : 0;

      setMetrics({
        fps: currentFps,
        avgFrameTime: parseFloat(avg.toFixed(2)),
        p95FrameTime: parseFloat(p95.toFixed(2)),
        variance: parseFloat(variance.toFixed(2)),
        longFrames: longFramesCountRef.current,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        textures: gl.info.memory.textures,
        programs: gl.info.programs.length,
        dpr: gl.getPixelRatio()
      });

      // Reset sample timer and frame count
      sampleTimerRef.current = 0;
      frameCounterRef.current = 0;
    }
  });

  return (
    <Html 
      position={[0, 0, 0]}
      fullscreen 
      style={{ 
        pointerEvents: 'none', 
        zIndex: 9999,
        userSelect: 'none'
      }}
    >
      <div 
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          background: 'rgba(9, 13, 25, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.22)',
          borderRadius: '12px',
          padding: '16px',
          width: '260px',
          color: '#e2e8f0',
          fontFamily: '"JetBrains Mono", "Fira Code", Monaco, monospace',
          fontSize: '10px',
          lineHeight: '1.6',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'auto',
          transformOrigin: 'bottom right',
          transform: 'scale(0.95)'
        }}
      >
        {/* Header Title */}
        <div style={{ 
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)', 
          paddingBottom: '8px', 
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            🛰️ ENGINE TELEMETRY
          </span>
          <span style={{ 
            fontSize: '8px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            padding: '2px 6px',
            borderRadius: '4px',
            marginLeft: 'auto'
          }}>
            DEV MODE
          </span>
        </div>

        {/* Core Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>FPS:</span>
            <span style={{ 
              color: metrics.fps >= 55 ? '#4ade80' : metrics.fps >= 35 ? '#facc15' : '#ef4444', 
              fontWeight: 'bold', 
              float: 'right' 
            }}>{metrics.fps}</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>DPR:</span>
            <span style={{ color: '#a78bfa', fontWeight: 'bold', float: 'right' }}>{metrics.dpr.toFixed(1)}</span>
          </div>

          <div>
            <span style={{ color: '#94a3b8' }}>Frame avg:</span>
            <span style={{ color: '#f8fafc', fontWeight: 'bold', float: 'right' }}>{metrics.avgFrameTime}ms</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>p95 Latency:</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold', float: 'right' }}>{metrics.p95FrameTime}ms</span>
          </div>

          <div>
            <span style={{ color: '#94a3b8' }}>Variance:</span>
            <span style={{ color: '#fb923c', fontWeight: 'bold', float: 'right' }}>{metrics.variance}</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Long frames:</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold', float: 'right' }}>{metrics.longFrames}</span>
          </div>

          <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

          <div>
            <span style={{ color: '#94a3b8' }}>Draw calls:</span>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', float: 'right' }}>{metrics.drawCalls}</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Triangles:</span>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', float: 'right' }}>
              {metrics.triangles > 1000 ? `${(metrics.triangles / 1000).toFixed(1)}k` : metrics.triangles}
            </span>
          </div>

          <div>
            <span style={{ color: '#94a3b8' }}>Textures:</span>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', float: 'right' }}>{metrics.textures}</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Shaders:</span>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', float: 'right' }}>{metrics.programs}</span>
          </div>
        </div>

        {/* Quality preset indicator */}
        <div style={{ 
          marginTop: '10px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '8px', 
          fontSize: '9px',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Visual Tier:</span>
          <span style={{ color: '#e2e8f0', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {quality.tier}
          </span>
        </div>
      </div>
    </Html>
  );
};

export default DevPerformanceOverlay;
