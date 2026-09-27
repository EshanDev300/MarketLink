import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * CurtainTransition Component
 * Sweeps a dual emerald stage curtain open whenever the user navigates between pages.
 */
export default function CurtainTransition() {
  const location = useLocation();
  const [curtainActive, setCurtainActive] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // When route changes, trigger the curtain open effect
    setCurtainActive(true);
    setIsOpening(false);

    // After brief moment, sweep open curtains
    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 120);

    // Once fully swept open, remove from DOM flow
    const finishTimer = setTimeout(() => {
      setCurtainActive(false);
      setIsOpening(false);
    }, 850);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [location.pathname]);

  if (!curtainActive) return null;

  return (
    <div
      className="curtain-transition-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        pointerEvents: isOpening ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Left Curtain Panel */}
      <div
        className="curtain-panel left"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #062b1a 0%, #064e3b 50%, #0f3e2b 100%)',
          boxShadow: '15px 0 35px rgba(0, 0, 0, 0.6), inset -5px 0 15px rgba(16, 185, 129, 0.4)',
          transform: isOpening ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)',
          borderRight: '2px solid rgba(52, 211, 153, 0.6)'
        }}
      >
        {/* Subtle drape folds */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0, 0, 0, 0.15) 40px, rgba(0, 0, 0, 0.15) 80px)',
            opacity: 0.7
          }}
        />
      </div>

      {/* Right Curtain Panel */}
      <div
        className="curtain-panel right"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50vw',
          height: '100vh',
          background: 'linear-gradient(225deg, #062b1a 0%, #064e3b 50%, #0f3e2b 100%)',
          boxShadow: '-15px 0 35px rgba(0, 0, 0, 0.6), inset 5px 0 15px rgba(16, 185, 129, 0.4)',
          transform: isOpening ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)',
          borderLeft: '2px solid rgba(52, 211, 153, 0.6)'
        }}
      >
        {/* Subtle drape folds */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0, 0, 0, 0.15) 40px, rgba(0, 0, 0, 0.15) 80px)',
            opacity: 0.7
          }}
        />
      </div>

      {/* Central Golden Emblem Sheen during split */}
      {!isOpening && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            color: '#34d399',
            fontSize: '1.8rem',
            filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))'
          }}
        >
          🌿
        </div>
      )}
    </div>
  );
}
