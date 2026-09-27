import React, { useEffect, useRef, useState } from 'react';

export default function PixelMagnetCursor() {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const mouseRef = useRef({
    x: -200,
    y: -200,
    targetX: -200,
    targetY: -200,
    isHovering: false,
    isClicking: false,
    hoverText: ''
  });
  const pointsRef = useRef([]);
  const ripplesRef = useRef([]);

  useEffect(() => {
    // Generate orbiting matrix of light glowing micro-pixels (Pixel Magnet effect)
    const count = 18;
    const points = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 16 + (i % 3) * 10;
      points.push({
        baseAngle: angle,
        currentAngle: angle,
        radius: radius,
        speed: 0.02 + (i % 3) * 0.012,
        x: -200,
        y: -200,
        size: (i % 2 === 0) ? 3 : 2,
        alpha: 0.4 + (i % 3) * 0.2,
        isCross: i % 4 === 0
      });
    }
    pointsRef.current = points;

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = (e) => {
      mouseRef.current.isClicking = true;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 36,
        alpha: 0.7
      });
    };

    const handleMouseUp = () => {
      mouseRef.current.isClicking = false;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('.card-product') ||
        target.closest('.depth-card-outer') ||
        target.closest('.shader-card-wrapper') ||
        target.closest('.interactive-globe-wrapper') ||
        target.closest('.peek-rating-box') ||
        target.closest('.fuse-btn-wrapper') ||
        target.closest('.border-glow-card') ||
        target.closest('.morph-slider-container')
      ) {
        mouseRef.current.isHovering = true;
      } else {
        mouseRef.current.isHovering = false;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Outer trailing ring coordinates (slower lerp)
    let ringX = -200;
    let ringY = -200;

    const render = () => {
      // Smooth lerp mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.35;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.35;

      ringX += (mouseRef.current.x - ringX) * 0.18;
      ringY += (mouseRef.current.y - ringY) * 0.18;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isHover = mouseRef.current.isHovering;
      const isClick = mouseRef.current.isClicking;

      // 1. Render Click Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += (r.maxRadius - r.radius) * 0.15;
        r.alpha -= 0.035;

        if (r.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${r.alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 2. Soft Ambient Radial Glow Aura
      const auraRadius = isHover ? 44 : 26;
      const radialGrad = ctx.createRadialGradient(mx, my, 1, mx, my, auraRadius);
      radialGrad.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
      radialGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.12)');
      radialGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(mx, my, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Pixel Magnet Orbital Cluster
      const currentRadiusMultiplier = isHover ? 1.55 : 1.0;

      pointsRef.current.forEach((p) => {
        p.currentAngle += p.speed;
        const targetRadius = p.radius * currentRadiusMultiplier;
        const px = mx + Math.cos(p.currentAngle) * targetRadius;
        const py = my + Math.sin(p.currentAngle) * targetRadius;

        p.x += (px - p.x) * 0.32;
        p.y += (py - p.y) * 0.32;

        ctx.save();
        ctx.fillStyle = isHover ? 'rgba(52, 211, 153, 0.9)' : `rgba(16, 185, 129, ${p.alpha})`;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = isHover ? 10 : 4;

        if (p.isCross) {
          const s = p.size;
          ctx.fillRect(p.x - s, p.y - 0.75, s * 2, 1.5);
          ctx.fillRect(p.x - 0.75, p.y - s, 1.5, s * 2);
        } else {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.restore();
      });

      // 4. Smooth Trailing Outer Ring (Custom Website Cursor)
      const ringTargetRadius = isClick ? 10 : (isHover ? 24 : 14);
      ctx.save();
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringTargetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isHover ? 'rgba(52, 211, 153, 0.85)' : 'rgba(16, 185, 129, 0.55)';
      ctx.lineWidth = isHover ? 2 : 1.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = isHover ? 8 : 4;
      ctx.stroke();
      ctx.restore();

      // 5. Central Laser Dot Pointer
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, isClick ? 2 : (isHover ? 4 : 3), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // Hide on coarse touch devices
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="custom-website-cursor-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease'
      }}
    />
  );
}
