import React, { useState } from 'react';

export default function PeekRating({ rating = 4.9, count = 28, label = 'Peak Freshness' }) {
  const [isPeeking, setIsPeeking] = useState(false);
  const [userRating, setUserRating] = useState(null);

  // Derive sentiment emoji and score based on rating
  const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 5.0;
  const sentimentEmoji = numericRating >= 4.9 ? '🌟' : (numericRating >= 4.7 ? '🌿' : '🥑');
  const peakScore = Math.min(100, Math.round(numericRating * 20));

  return (
    <div
      className="peek-rating-box position-relative d-inline-block"
      onMouseEnter={() => setIsPeeking(true)}
      onMouseLeave={() => setIsPeeking(false)}
      style={{ verticalAlign: 'middle' }}
    >
      {/* Peek Rating Pill Tag */}
      <button
        type="button"
        className="btn btn-sm p-0 border-0 bg-transparent d-inline-flex align-items-center gap-1 peek-trigger-btn"
        onClick={() => setIsPeeking(prev => !prev)}
        title="Hover to peek customer harvest sentiments & freshness score"
        aria-label="Peek Rating breakdown"
        style={{
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <span
          className="badge d-inline-flex align-items-center gap-1 px-2 py-0.5 rounded-pill shadow-xs"
          style={{
            background: isPeeking ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(16, 185, 129, 0.12)',
            color: isPeeking ? '#ffffff' : 'var(--emerald-accent)',
            border: '1px solid var(--card-border-glow)',
            fontSize: '0.68rem',
            fontWeight: '700',
            letterSpacing: '0.02em',
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span className="animate-bounce-subtle">{sentimentEmoji}</span>
          <span>{numericRating.toFixed(1)}</span>
          <span className="opacity-75">Peak</span>
        </span>
      </button>

      {/* Floating Animated Peek Tooltip Card */}
      <div
        className="peek-rating-flyout shadow-xl rounded-4 p-3 border"
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: isPeeking ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(8px) scale(0.95)',
          opacity: isPeeking ? 1 : 0,
          pointerEvents: isPeeking ? 'auto' : 'none',
          visibility: isPeeking ? 'visible' : 'hidden',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border-glow)',
          width: '210px',
          zIndex: 1060,
          boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.3), 0 0 20px rgba(16, 185, 129, 0.2)'
        }}
      >
        {/* Peek Header */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-1.5">
            <span className="fs-5">{sentimentEmoji}</span>
            <span className="fw-bold small font-heading text-dark-emphasis" style={{ fontSize: '0.82rem' }}>
              {label}
            </span>
          </div>
          <span className="badge bg-success-subtle text-success rounded-pill px-2 py-0.5 fw-bold" style={{ fontSize: '0.65rem' }}>
            {peakScore}%
          </span>
        </div>

        {/* Micro Freshness Score Bar */}
        <div className="progress mb-2" style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '9999px' }}>
          <div
            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
            style={{ width: `${peakScore}%`, borderRadius: '9999px' }}
          />
        </div>

        {/* Interactive Star Sentiment Picker */}
        <div className="d-flex align-items-center justify-content-between pt-1 border-top" style={{ fontSize: '0.72rem' }}>
          <span className="text-muted">{count} Stall Reviews</span>
          <div className="d-flex gap-0.5 text-warning">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setUserRating(star)}
                style={{
                  cursor: 'pointer',
                  transform: (userRating || numericRating) >= star ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.15s ease'
                }}
                title={`Rate ${star} star`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {userRating && (
          <div className="text-center mt-1 text-success fw-bold" style={{ fontSize: '0.68rem' }}>
            ✓ Voted {userRating} Stars!
          </div>
        )}
      </div>
    </div>
  );
}
