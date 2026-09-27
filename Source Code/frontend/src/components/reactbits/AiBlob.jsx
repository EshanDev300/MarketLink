import React from 'react';

/**
 * ReactBits AI Blob (Pro) Component - Customized in MarketLink Emerald Theme
 * Features:
 * - Ultra-smooth continuous SVG path morphing animation
 * - Multi-layer fluid gradient and specular highlight
 * - Radial ambient glow and pulsing energy rings
 * - Internal responsive AI core
 */
export default function AiBlob({ 
  size = 48, 
  className = '', 
  glow = true,
  state = 'idle', // 'idle' | 'thinking' | 'speaking'
  onClick = null 
}) {
  // SVG path morph states for organic fluid blob deformation
  const pathD1 = "M 42,-68 C 55,-62 67,-51 74,-37 C 81,-23 83,-7 82,9 C 81,25 76,41 66,54 C 56,67 41,77 25,81 C 9,85 -7,83 -22,78 C -37,73 -50,65 -61,53 C -72,41 -80,26 -81,9 C -82,-7 -76,-25 -67,-39 C -58,-53 -46,-64 -32,-70 C -18,-76 2,-78 18,-76 C 34,-74 29,-74 42,-68 Z";
  const pathD2 = "M 35,-61 C 48,-53 59,-42 67,-29 C 75,-16 80,0 79,15 C 78,31 71,46 60,57 C 49,68 34,75 18,79 C 2,83 -15,84 -30,79 C -45,74 -58,63 -67,49 C -76,35 -81,18 -79,1 C -77,-15 -68,-30 -57,-42 C -46,-54 -33,-63 -19,-67 C -5,-71 11,-70 24,-68 C 37,-66 22,-69 35,-61 Z";
  const pathD3 = "M 48,-56 C 59,-44 65,-28 69,-12 C 73,4 75,20 70,35 C 65,50 53,64 38,72 C 23,80 5,82 -12,80 C -29,78 -45,72 -57,61 C -69,50 -77,34 -80,17 C -83,0 -81,-18 -73,-33 C -65,-48 -51,-60 -36,-66 C -21,-72 -5,-72 10,-71 C 25,-70 37,-68 48,-56 Z";
  const pathD4 = "M 40,-64 C 52,-57 63,-46 71,-33 C 79,-20 84,-5 83,10 C 82,25 75,40 64,52 C 53,64 38,73 22,77 C 6,81 -11,81 -26,76 C -41,71 -54,61 -64,48 C -74,35 -80,19 -79,3 C -78,-13 -70,-28 -59,-40 C -48,-52 -34,-61 -19,-66 C -4,-71 12,-71 26,-69 C 40,-67 28,-71 40,-64 Z";

  return (
    <div
      className={`ai-blob-container position-relative d-inline-flex align-items-center justify-content-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
      onClick={onClick}
    >
      {/* Outer Radiant Glow */}
      {glow && (
        <div
          className="ai-blob-ambient-glow position-absolute"
          style={{
            width: '130%',
            height: '130%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(52, 211, 153, 0.25) 45%, transparent 72%)',
            filter: 'blur(10px)',
            animation: state === 'thinking' ? 'aiBlobThinkingPulse 1.2s ease-in-out infinite' : 'aiBlobPulse 3.5s ease-in-out infinite alternate',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Orbiting Subtle Glow Rings */}
      <div
        className="ai-blob-orbit-ring position-absolute"
        style={{
          width: '105%',
          height: '105%',
          borderRadius: '50%',
          border: '1.5px dashed rgba(52, 211, 153, 0.4)',
          animation: 'aiBlobRotateRing 12s linear infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Main SVG Morphing Blob */}
      <svg
        viewBox="0 0 200 200"
        className="ai-blob-svg"
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.4))',
          transformOrigin: 'center center'
        }}
      >
        <defs>
          {/* Multi-stop emerald radiant gradient */}
          <linearGradient id="aiBlobThemeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="35%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Internal Specular Highlight */}
          <radialGradient id="aiBlobHighlight" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="30%" stopColor="#6ee7b7" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Morphing Base Mesh */}
        <g transform="translate(100 100)">
          <path
            fill="url(#aiBlobThemeGrad)"
            d={pathD1}
          >
            <animate
              attributeName="d"
              dur={state === 'thinking' ? '3s' : '7s'}
              repeatCount="indefinite"
              values={`${pathD1}; ${pathD2}; ${pathD3}; ${pathD4}; ${pathD1}`}
              keyTimes="0; 0.33; 0.66; 0.85; 1"
            />
          </path>

          {/* Specular Highlight Overlay */}
          <path
            fill="url(#aiBlobHighlight)"
            d={pathD1}
            opacity="0.75"
          >
            <animate
              attributeName="d"
              dur={state === 'thinking' ? '3s' : '7s'}
              repeatCount="indefinite"
              values={`${pathD1}; ${pathD2}; ${pathD3}; ${pathD4}; ${pathD1}`}
              keyTimes="0; 0.33; 0.66; 0.85; 1"
            />
          </path>

          {/* Core AI Iris & Sparkle */}
          <circle cx="-2" cy="-4" r="16" fill="#ffffff" opacity="0.9" />
          <circle cx="0" cy="-3" r="8" fill="#064e3b" />
          <circle cx="2.5" cy="-5.5" r="3" fill="#ffffff" />

          {/* Digital Smile Arc */}
          <path
            d="M -16 16 Q 0 28 16 16"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.92"
          />

          {/* Interactive Floating Micro-Dots */}
          <circle cx="-35" cy="-25" r="2.5" fill="#a7f3d0" opacity="0.8">
            <animate attributeName="cy" values="-25;-29;-25" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="36" cy="18" r="2.2" fill="#a7f3d0" opacity="0.8">
            <animate attributeName="cy" values="18;14;18" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
