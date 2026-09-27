import React, { useRef, useState } from 'react';

export default function BorderGlow({
  children,
  className = '',
  style = {},
  glowColor = 'rgba(16, 185, 129, 0.85)',
  secondaryColor = 'rgba(52, 211, 153, 0.4)',
  glowSize = 260,
  borderRadius = '24px',
  ...props
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: -1000, y: -1000, isHovered: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true
    });
  };

  const handleMouseLeave = () => {
    setCoords(prev => ({ ...prev, isHovered: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`border-glow-card position-relative overflow-hidden ${className}`}
      style={{
        borderRadius,
        padding: '1.5px', // Border thickness
        background: coords.isHovered
          ? `radial-gradient(${glowSize}px circle at ${coords.x}px ${coords.y}px, ${glowColor} 0%, ${secondaryColor} 40%, var(--card-border, rgba(16, 185, 129, 0.2)) 100%)`
          : 'var(--card-border, rgba(16, 185, 129, 0.2))',
        transition: 'background 0.15s ease, box-shadow 0.3s ease',
        boxShadow: coords.isHovered
          ? '0 15px 35px -5px rgba(16, 185, 129, 0.2), 0 0 15px rgba(16, 185, 129, 0.15)'
          : 'none',
        ...style
      }}
      {...props}
    >
      {/* Inner Card Content Container */}
      <div
        className="w-100 h-100"
        style={{
          borderRadius: `calc(${borderRadius} - 1.5px)`,
          background: 'var(--card-bg, #ffffff)',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
}
