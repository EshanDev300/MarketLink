import React, { useState } from 'react';

export default function GradientCarousel({ items = [], speed = 35, direction = 'left' }) {
  const [isPaused, setIsPaused] = useState(false);

  // Default items if none provided
  const carouselItems = items.length > 0 ? items : [
    {
      icon: '🌱',
      title: '100% Certified Organic',
      subtitle: 'Zero Synthetic Sprays',
      badge: 'Verified Soil',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.25))'
    },
    {
      icon: '🚜',
      title: 'Direct From Local Farmers',
      subtitle: 'No Wholesaler Cuts',
      badge: 'Fair Trade',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(21, 128, 61, 0.25))'
    },
    {
      icon: '☀️',
      title: 'Sunrise Dawn Harvest',
      subtitle: 'Picked Same-Day Fresh',
      badge: 'Fresh Daily',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.25))'
    },
    {
      icon: '🧺',
      title: 'Zero Gateway Pre-Orders',
      subtitle: 'Reserve Free, Pay at Stall',
      badge: '0% Platform Fee',
      gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(2, 132, 199, 0.25))'
    },
    {
      icon: '🥑',
      title: 'Heirloom & Rare Varieties',
      subtitle: 'Heritage Seeds & Taste',
      badge: 'Gourmet',
      gradient: 'linear-gradient(135deg, rgba(132, 204, 22, 0.15), rgba(101, 163, 13, 0.25))'
    },
    {
      icon: '💚',
      title: 'Zero Single-Use Plastic',
      subtitle: 'Biodegradable Crates',
      badge: 'Eco Verified',
      gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(13, 148, 136, 0.25))'
    }
  ];

  // Duplicate items for seamless continuous infinite marquee loop
  const duplicatedItems = [...carouselItems, ...carouselItems, ...carouselItems];

  return (
    <div
      className="gradient-carousel-wrapper position-relative overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
      }}
    >
      <div
        className="gradient-carousel-track d-flex gap-4"
        style={{
          width: 'max-content',
          animation: `gradientCarouselScroll ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
          animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="gradient-carousel-card p-4 rounded-4 shadow-sm border"
            style={{
              minWidth: '280px',
              maxWidth: '320px',
              background: item.gradient || 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(52, 211, 153, 0.05))',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(16, 185, 129, 0.22)',
              boxShadow: '0 8px 24px -6px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fs-1">{item.icon}</span>
              {item.badge && (
                <span
                  className="badge rounded-pill fw-semibold px-2.5 py-1 text-white"
                  style={{ background: '#10b981', fontSize: '0.72rem', letterSpacing: '0.04em' }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <h6 className="fw-bold mb-1 font-heading text-dark-emphasis">{item.title}</h6>
            <p className="small text-muted mb-0">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
