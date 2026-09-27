import React from 'react';

export default function LatticeLoader({ size = 38, glowColor = '#10b981', label = 'Thinking...' }) {
  const nodes = [
    { row: 0, col: 0, delay: '0s' },
    { row: 0, col: 1, delay: '0.15s' },
    { row: 0, col: 2, delay: '0.3s' },
    { row: 1, col: 0, delay: '0.15s' },
    { row: 1, col: 1, delay: '0.3s' },
    { row: 1, col: 2, delay: '0.45s' },
    { row: 2, col: 0, delay: '0.3s' },
    { row: 2, col: 1, delay: '0.45s' },
    { row: 2, col: 2, delay: '0.6s' }
  ];

  return (
    <div className="lattice-loader-container d-inline-flex align-items-center gap-3 p-2 rounded-4">
      {/* 3x3 Matrix Grid with Glowing Lattice Lines */}
      <div
        className="lattice-loader-grid"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '4px',
          padding: '2px',
          filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 18px rgba(16, 185, 129, 0.45))`
        }}
      >
        {/* Horizontal and vertical glowing connector grid overlay */}
        <div
          className="lattice-connectors"
          style={{
            position: 'absolute',
            inset: '6px',
            border: `1px solid rgba(16, 185, 129, 0.35)`,
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />

        {nodes.map((node, i) => (
          <div
            key={i}
            className="lattice-node"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              className="lattice-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: glowColor,
                boxShadow: `0 0 8px ${glowColor}, 0 0 14px ${glowColor}`,
                animation: `latticePulse 1.4s infinite ease-in-out alternate`,
                animationDelay: node.delay
              }}
            />
          </div>
        ))}
      </div>

      {label && (
        <div className="lattice-label small fw-semibold" style={{ color: glowColor, letterSpacing: '0.03em' }}>
          <span className="shimmer-text">{label}</span>
        </div>
      )}
    </div>
  );
}
