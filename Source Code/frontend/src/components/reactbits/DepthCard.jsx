import React, { useRef, useState } from 'react';
import PeekRating from './PeekRating';

export default function DepthCard({
  image,
  title,
  subtitle,
  badge,
  price,
  rating,
  tags = [],
  onClick,
  children,
  className = ''
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setCoords({ x, y, rotateX, rotateY, percentX: (x / rect.width) * 100, percentY: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0, rotateX: 0, rotateY: 0, percentX: 50, percentY: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={`depth-card-outer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1200px',
        cursor: onClick ? 'pointer' : 'default',
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className="depth-card-inner"
        style={{
          transform: isHovered
            ? `rotateX(${coords.rotateX || 0}deg) rotateY(${coords.rotateY || 0}deg) scale3d(1.025, 1.025, 1.025)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--card-border-glow, rgba(16, 185, 129, 0.25))',
          boxShadow: isHovered
            ? '0 20px 40px -15px rgba(16, 185, 129, 0.25), 0 0 25px rgba(52, 211, 153, 0.2)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Dynamic Specular Glare Reflection */}
        {isHovered && (
          <div
            className="depth-card-glare"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 10,
              background: `radial-gradient(circle 280px at ${coords.percentX || 50}% ${coords.percentY || 50}%, rgba(255, 255, 255, 0.32), transparent 70%)`,
              mixBlendMode: 'overlay',
              borderRadius: '24px'
            }}
          />
        )}

        {/* Parallax Image Layer */}
        {image && (
          <div
            className="depth-card-img-wrap position-relative"
            style={{
              overflow: 'hidden',
              height: '220px',
              transform: isHovered ? 'translateZ(30px) scale(1.06)' : 'translateZ(0px) scale(1)',
              transition: 'transform 0.4s ease'
            }}
          >
            <img
              src={image}
              alt={title || 'Product'}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {badge && (
              <span
                className="badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold text-white shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)',
                  transition: 'transform 0.3s ease',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em'
                }}
              >
                {badge}
              </span>
            )}
          </div>
        )}

        {/* Card Body Content with 3D Depth Elevation */}
        <div
          className="p-4"
          style={{
            transform: isHovered ? 'translateZ(40px)' : 'translateZ(0px)',
            transition: 'transform 0.3s ease'
          }}
        >
          {subtitle && (
            <div className="text-uppercase fw-semibold mb-1" style={{ fontSize: '0.72rem', color: '#10b981', letterSpacing: '0.08em' }}>
              {subtitle}
            </div>
          )}
          {title && <h5 className="fw-bold mb-2 font-heading">{title}</h5>}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-3">
              {tags.map((t, idx) => (
                <span key={idx} className="badge bg-success-subtle text-success rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Price & Rating Bar */}
          <div className="d-flex align-items-center justify-content-between pt-2 border-top">
            {price && (
              <div className="fw-extrabold fs-5" style={{ color: 'var(--primary-dark, #064e3b)' }}>
                {price}
              </div>
            )}
            {rating && (
              <div className="d-flex align-items-center gap-1.5">
                <div className="small fw-semibold text-warning d-flex align-items-center gap-1">
                  <i className="bi bi-star-fill"></i>
                  <span className="text-dark-emphasis">{rating}</span>
                </div>
                <PeekRating rating={4.9} count={38} label="Harvest Score" />
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
