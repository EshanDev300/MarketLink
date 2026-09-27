import React, { useState, useRef, useEffect } from 'react';

export default function FuseButton({
  onConfirm,
  label = 'Cancel Pre-Order',
  confirmingLabel = 'Hold to Cancel...',
  burningDuration = 1400,
  className = ''
}) {
  const [isBurning, setIsBurning] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const startBurning = () => {
    setIsBurning(true);
    setProgress(0);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / burningDuration) * 100);
      setProgress(pct);
    }, 20);

    timerRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current);
      setIsBurning(false);
      setProgress(100);
      if (onConfirm) onConfirm();
    }, burningDuration);
  };

  const cancelBurning = () => {
    if (isBurning) {
      clearTimeout(timerRef.current);
      clearInterval(progressIntervalRef.current);
      setIsBurning(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <div className={`fuse-btn-wrapper position-relative d-inline-block ${className}`}>
      <button
        type="button"
        onMouseDown={startBurning}
        onMouseUp={cancelBurning}
        onMouseLeave={cancelBurning}
        onTouchStart={startBurning}
        onTouchEnd={cancelBurning}
        className="btn btn-sm position-relative overflow-hidden rounded-pill px-3 py-1.5 shadow-sm fuse-button-element"
        style={{
          background: isBurning ? '#7f1d1d' : 'rgba(239, 68, 68, 0.12)',
          borderColor: isBurning ? '#ef4444' : 'rgba(239, 68, 68, 0.4)',
          color: isBurning ? '#ffffff' : '#ef4444',
          fontSize: '0.78rem',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
        title="Press and hold to burn fuse and cancel order"
      >
        {/* Burning Fuse Track Progress */}
        <div
          className="position-absolute top-0 start-0 h-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(245, 158, 11, 0.6))',
            transition: 'width 0.05s linear',
            zIndex: 1
          }}
        />

        {/* Traveling Spark at the head of the fuse */}
        {isBurning && (
          <span
            className="position-absolute fuse-spark"
            style={{
              top: '50%',
              left: `${progress}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              fontSize: '1rem',
              filter: 'drop-shadow(0 0 6px #f59e0b)'
            }}
          >
            🔥
          </span>
        )}

        {/* Button Content */}
        <span className="position-relative d-inline-flex align-items-center gap-1.5" style={{ zIndex: 2 }}>
          <span style={{ fontSize: '0.85rem' }}>{isBurning ? '🧨' : '✖'}</span>
          <span>{isBurning ? confirmingLabel : label}</span>
          {isBurning && (
            <span className="badge bg-danger rounded-pill px-1.5 py-0.5 ms-1" style={{ fontSize: '0.62rem' }}>
              {Math.round(progress)}%
            </span>
          )}
        </span>
      </button>

      {/* Small instructional helper hint */}
      {isBurning && (
        <div
          className="small text-danger fw-semibold position-absolute start-50 translate-middle-x mt-1 text-nowrap animate-fade-in"
          style={{ fontSize: '0.65rem', top: '100%', zIndex: 10 }}
        >
          Keep holding to ignite fuse!
        </div>
      )}
    </div>
  );
}
