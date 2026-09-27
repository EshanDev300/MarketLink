import React, { useEffect, useRef, useState } from 'react';

export default function WebsiteCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouse = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('.card-product') ||
        target.closest('.depth-card-outer') ||
        target.closest('.shader-card-wrapper') ||
        target.closest('.interactive-globe-wrapper')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);

    let animId;
    const render = () => {
      // Smooth lerp for outer ring
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.24;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.24;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.targetX}px, ${mouse.current.targetY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="website-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          boxShadow: '0 0 10px #10b981, 0 0 18px rgba(52, 211, 153, 0.6)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          marginLeft: '-4px',
          marginTop: '-4px',
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Smooth Trailing Magnetic Glowing Ring */}
      <div
        ref={ringRef}
        className={`website-cursor-ring ${isHovered ? 'hovered' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '52px' : '34px',
          height: isHovered ? '52px' : '34px',
          borderRadius: '50%',
          border: `2px solid ${isHovered ? '#34d399' : 'rgba(16, 185, 129, 0.45)'}`,
          backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
          boxShadow: isHovered ? '0 0 20px rgba(16, 185, 129, 0.35)' : 'none',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: isVisible ? 1 : 0,
          marginLeft: isHovered ? '-26px' : '-17px',
          marginTop: isHovered ? '-26px' : '-17px',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), margin 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, background-color 0.2s, opacity 0.2s'
        }}
      />
    </>
  );
}
