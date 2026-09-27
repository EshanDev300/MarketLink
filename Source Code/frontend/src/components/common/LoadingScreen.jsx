import React, { useState, useEffect } from 'react';
import MarketLinkLogo from './MarketLinkLogo';

const TELEMETRY_STAGES = [
  { pct: 15, tag: 'INIT 01', text: 'Calibrating Hyperlocal Soil Microbiome Sensors...' },
  { pct: 42, tag: 'SYNC 02', text: 'Synchronizing Morning Dew & Sunrise Crop Yields...' },
  { pct: 74, tag: 'ORCH 03', text: 'Engaging Direct Grower Hand-off & 0% Fee Pipeline...' },
  { pct: 92, tag: 'AI 04', text: 'Booting Gemini 3.8 Multilingual Farm Intelligence...' },
  { pct: 100, tag: 'LIVE 05', text: 'MarketLink Eco Matrix Ready • Pure Organic Fresh!' }
];

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [smoothPct, setSmoothPct] = useState(8);

  useEffect(() => {
    // Smooth progress counter increment
    const progressTimer = setInterval(() => {
      setSmoothPct(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, prev + 2.5);
      });
    }, 30);

    const s1 = setTimeout(() => setStageIdx(1), 320);
    const s2 = setTimeout(() => setStageIdx(2), 650);
    const s3 = setTimeout(() => setStageIdx(3), 950);
    const s4 = setTimeout(() => setStageIdx(4), 1250);

    const fadeTimer = setTimeout(() => setFadeOut(true), 1500);
    const exitTimer = setTimeout(() => setLoading(false), 2000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(s4);
      clearTimeout(fadeTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  if (!loading) return null;

  const currentStage = TELEMETRY_STAGES[stageIdx] || TELEMETRY_STAGES[0];

  return (
    <div
      className={`unique-loading-screen ${fadeOut ? 'loading-screen-fade' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#040b07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s ease',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: fadeOut ? 'none' : 'auto'
      }}
    >
      {/* Background Cyber-Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.85,
          pointerEvents: 'none'
        }}
      />

      {/* Radiant Glowing Sprout Hologram Core */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-4">
        {/* Soft Ambient Radial Blur Aura */}
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.15) 45%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'aiBlobPulse 2.8s ease-in-out infinite alternate',
            pointerEvents: 'none'
          }}
        />

        {/* Outer Counter-Rotating Geometric Rings */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(52, 211, 153, 0.4)',
            animation: 'aiBlobRotateRing 12s linear infinite',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '330px',
            height: '330px',
            borderRadius: '50%',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            animation: 'aiBlobRotateRing 18s linear infinite reverse',
            pointerEvents: 'none'
          }}
        />

        {/* Central Sprout Logo with Floating Levitation */}
        <div
          className="p-3.5 rounded-circle shadow-2xl position-relative"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(6, 78, 59, 0.8) 100%)',
            border: '2px solid rgba(52, 211, 153, 0.5)',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.6), inset 0 0 20px rgba(52, 211, 153, 0.3)',
            animation: 'floatSlow 4s ease-in-out infinite'
          }}
        >
          <MarketLinkLogo size={68} />
        </div>
      </div>

      {/* Main HUD Loading Console */}
      <div className="position-relative text-center px-4" style={{ zIndex: 2, maxWidth: '460px', width: '100%' }}>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
          <span className="badge rounded-pill bg-success bg-opacity-25 text-success border border-success border-opacity-40 px-3 py-1 fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
            ✦ {currentStage.tag}
          </span>
          <span className="font-heading fw-bold text-success fs-6">
            {Math.round(smoothPct)}%
          </span>
        </div>

        <h4 className="fw-extrabold text-white mb-2 font-heading tracking-wide" style={{ letterSpacing: '-0.01em' }}>
          Market<span className="text-success">Link</span>
        </h4>

        {/* Dynamic Telemetry Status Ticker */}
        <div
          key={stageIdx}
          className="small text-light text-opacity-80 mb-4 animate-fade-in font-monospace"
          style={{ fontSize: '0.82rem', minHeight: '24px' }}
        >
          <span className="text-success me-1.5">▶</span>
          {currentStage.text}
        </div>

        {/* High-Tech Progress Laser Bar */}
        <div
          className="position-relative overflow-hidden rounded-pill p-0.5"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            height: '10px'
          }}
        >
          <div
            className="h-100 rounded-pill position-relative"
            style={{
              width: `${smoothPct}%`,
              background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
              boxShadow: '0 0 15px #10b981, 0 0 30px rgba(52, 211, 153, 0.5)',
              transition: 'width 0.08s linear'
            }}
          >
            {/* Spark at the tip */}
            <div
              className="position-absolute end-0 top-50 translate-middle-y"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 8px #ffffff'
              }}
            />
          </div>
        </div>

        {/* Bottom Micro-Badge */}
        <div className="mt-3.5 d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.68rem' }}>
          <span>Aptech TechWiz 7 Championship Platform</span>
          <span className="text-success fw-semibold">● 100% CCOF Soil Protocol</span>
        </div>
      </div>
    </div>
  );
}
