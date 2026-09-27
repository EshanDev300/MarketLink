import React, { useEffect, useRef, useState } from 'react';

export default function ShaderCard({
  title = 'Direct Farm-to-Fork Protocol',
  subtitle = 'Certified Eco Standard',
  badge = 'Zero Middleman',
  description = 'Pre-ordered harvest baskets bypass commercial cold storage warehouses, traveling under 25 miles directly from farm gate to market stall.',
  stats = [
    { label: 'Food Waste', val: '0%' },
    { label: 'Freshness Peak', val: '< 6 hrs' },
    { label: 'Farmer Direct', val: '100%' }
  ],
  children,
  className = ''
}) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Create procedural fluid gradient shader simulation
      const grad = ctx.createLinearGradient(
        w * (0.2 + 0.3 * Math.sin(time * 0.7)),
        h * (0.2 + 0.3 * Math.cos(time * 0.5)),
        w * (0.8 + 0.2 * Math.cos(time * 0.8)),
        h * (0.8 + 0.2 * Math.sin(time * 0.6))
      );

      // Organic Nature Emerald & Mint Color Palette
      grad.addColorStop(0, 'rgba(6, 78, 59, 0.85)');
      grad.addColorStop(0.35, 'rgba(16, 185, 129, 0.75)');
      grad.addColorStop(0.7, 'rgba(52, 211, 153, 0.6)');
      grad.addColorStop(1, 'rgba(132, 204, 22, 0.45)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw subtle luminous wave ribbons
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;

      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 15) {
          const y = h * 0.5 + Math.sin(x * 0.015 + time + j) * 35 + (mouse.y - 0.5) * 40;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [mouse]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`shader-card-wrapper position-relative overflow-hidden rounded-4 shadow-lg border ${className}`}
      style={{
        borderColor: 'rgba(52, 211, 153, 0.35)',
        minHeight: '340px',
        boxShadow: '0 20px 45px -10px rgba(16, 185, 129, 0.3), 0 0 25px rgba(52, 211, 153, 0.2)'
      }}
    >
      {/* Background Animated Canvas Shader */}
      <canvas
        ref={canvasRef}
        className="shader-canvas position-absolute top-0 start-0 w-100 h-100"
        style={{ pointerEvents: 'none', zIndex: 1 }}
      />

      {/* Glassmorphic Content Plate */}
      <div
        className="position-relative p-4 p-md-5 d-flex flex-column h-100 text-white"
        style={{
          zIndex: 2,
          background: 'rgba(6, 20, 13, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="badge rounded-pill bg-white bg-opacity-20 text-white border border-white border-opacity-25 px-3 py-1.5 fw-semibold" style={{ fontSize: '0.78rem' }}>
            ⚡ {badge}
          </span>
          <span className="small text-white-50 fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
            {subtitle}
          </span>
        </div>

        <h3 className="fw-bold mb-2 font-heading text-white">{title}</h3>
        <p className="text-white-50 small mb-4 flex-grow-1" style={{ lineHeight: '1.65', maxWidth: '580px' }}>
          {description}
        </p>

        {/* Stats Row */}
        {stats && stats.length > 0 && (
          <div className="row g-3 pt-3 border-top border-white border-opacity-20 mt-auto">
            {stats.map((s, idx) => (
              <div key={idx} className="col-4">
                <div className="fs-4 fw-extrabold text-white font-heading">{s.val}</div>
                <div className="small text-white-50 fw-semibold" style={{ fontSize: '0.72rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
