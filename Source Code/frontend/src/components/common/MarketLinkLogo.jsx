import React from 'react';

/**
 * All-New Modern MarketLink Brand Logo (eGreen Basket)
 * An iconic, high-end emblem featuring interlocking organic leaves forming a market "Link" infinity loop,
 * with a golden sunrise seed core and multi-depth emerald glass badge.
 */
export default function MarketLinkLogo({ size = 42, className = '' }) {
  return (
    <div
      className={`marketlink-brand-emblem position-relative d-inline-flex align-items-center justify-content-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: 'drop-shadow(0 4px 14px rgba(16, 185, 129, 0.45))'
      }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          {/* Main Leaf Gradient */}
          <linearGradient id="nmlLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Secondary Link Arc Gradient */}
          <linearGradient id="nmlLeaf2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Golden Harvest Core Dot */}
          <linearGradient id="nmlGoldSeed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Badge Background Gradient */}
          <linearGradient id="nmlBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
        </defs>

        {/* Circular Outer Aura Plate */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="url(#nmlBadgeBg)"
          stroke="rgba(52, 211, 153, 0.35)"
          strokeWidth="2.5"
        />

        {/* Inner Subtle Rotating Ring */}
        <circle
          cx="60"
          cy="60"
          r="47"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Primary Ascending Eco Leaf */}
        <path
          d="M 60 22 C 78 22 96 38 94 62 C 92 80 76 96 52 98 C 44 98 40 92 42 84 C 44 76 52 70 60 66 C 74 60 80 48 76 36 C 72 26 64 22 60 22 Z"
          fill="url(#nmlLeaf1)"
        />

        {/* Interlocking "Link" Loop Leaf */}
        <path
          d="M 60 98 C 42 98 24 82 26 58 C 28 40 44 24 68 22 C 76 22 80 28 78 36 C 76 44 68 50 60 54 C 46 60 40 72 44 84 C 48 94 56 98 60 98 Z"
          fill="url(#nmlLeaf2)"
          opacity="0.92"
        />

        {/* Central Intersecting Golden Sprout Core */}
        <circle cx="60" cy="60" r="10" fill="url(#nmlGoldSeed)" />
        <circle cx="58" cy="58" r="3.5" fill="#ffffff" opacity="0.8" />

        {/* Upper Leaf Rib Sheen Accent */}
        <path
          d="M 60 26 Q 72 38 72 52"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
          fill="none"
        />
        <path
          d="M 60 94 Q 48 82 48 68"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
          fill="none"
        />
      </svg>
    </div>
  );
}
