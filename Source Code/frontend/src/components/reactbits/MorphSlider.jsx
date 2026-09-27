import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    id: 'morph_01',
    badge: 'SUNRISE ORCHARD HARVEST',
    title: 'Heirloom Vine Strawberries & White Peaches',
    farmer: 'Sarah Jenkins • Sunny Meadow Orchards',
    description: 'Sun-warmed Albion strawberries bursting with natural sweetness paired with velvety white nectarines, hand-harvested at 5:30 AM before the morning dew evaporates.',
    price: '$24.50',
    unit: 'Hand-packed 4-Basket Hamper',
    tags: ['Picked 3h Ago', 'Zero Cold Storage', '100% Organic'],
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1000&q=80',
    color: '#059669',
    rating: '5.0 ★ (48 reviews)'
  },
  {
    id: 'morph_02',
    badge: 'ARTISAN HILLSIDE GUILD',
    title: '36-Hour Sourdough & Wildflower Comb',
    farmer: 'Miguel Alvarez • Artisan Apiary & Bakery',
    description: 'Slow-fermented artisan sourdough boule with a blistering mahogany crust, served beside raw unfiltered honeycomb harvested straight from hilltop wildflower frames.',
    price: '$32.00',
    unit: 'Farmstead Breakfast Pair',
    tags: ['Stoneground Flour', 'Wild Ferment', 'Raw Honey'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    color: '#d97706',
    rating: '4.9 ★ (62 reviews)'
  },
  {
    id: 'morph_03',
    badge: 'REGENERATIVE VALLEY HARVEST',
    title: 'Dragon Carrots, Chanterelles & Heirloom Greens',
    farmer: 'John Peterson • Green Valley Organic Farm',
    description: 'Vibrant purple dragon carrots, forest-foraged golden chanterelles, and peppery Tuscan kale grown in certified living soil enriched with biodynamic compost.',
    price: '$28.00',
    unit: 'Chef Culinary Crate',
    tags: ['Living Soil', 'Zero Pesticides', 'Heritage Seeds'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    color: '#047857',
    rating: '5.0 ★ (35 reviews)'
  }
];

export default function MorphSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const slide = SLIDES[current];

  return (
    <div
      className="morph-slider-container position-relative overflow-hidden rounded-5 border p-4 p-lg-5"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
      style={{
        background: 'var(--card-bg, #ffffff)',
        borderColor: 'var(--card-border-glow, rgba(16, 185, 129, 0.3))',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 35px rgba(16, 185, 129, 0.15)'
      }}
    >
      <div className="row align-items-center g-5">
        {/* Left Column: Slide Content */}
        <div className="col-12 col-lg-7">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span
              className="badge rounded-pill fw-bold text-white px-3 py-1.5 shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${slide.color}, #10b981)`,
                fontSize: '0.74rem',
                letterSpacing: '0.06em'
              }}
            >
              ✨ {slide.badge}
            </span>
            <span className="small text-muted fw-semibold">{slide.rating}</span>
          </div>

          <h3
            key={`title-${current}`}
            className="display-6 fw-extrabold mb-3 font-heading text-dark-emphasis animate-fade-in"
            style={{ lineHeight: '1.25' }}
          >
            {slide.title}
          </h3>

          <div className="small text-success fw-bold mb-3 d-flex align-items-center gap-1.5">
            <i className="bi bi-geo-alt-fill text-danger"></i>
            {slide.farmer}
          </div>

          <p
            key={`desc-${current}`}
            className="text-secondary mb-4 animate-fade-in"
            style={{ fontSize: '0.96rem', lineHeight: '1.7' }}
          >
            {slide.description}
          </p>

          {/* Tags */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {slide.tags.map((t, idx) => (
              <span
                key={idx}
                className="badge rounded-pill bg-body-tertiary text-dark-emphasis border px-3 py-1.5 small fw-semibold"
              >
                🌱 {t}
              </span>
            ))}
          </div>

          {/* Price & Action Row */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top">
            <div>
              <div className="fs-3 fw-extrabold text-success font-heading">{slide.price}</div>
              <div className="small text-muted">{slide.unit}</div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn btn-egreen rounded-pill px-4 py-2 shadow-sm"
              >
                <i className="bi bi-basket me-1"></i> Pre-Order Collection
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Morphing Shape Image Container */}
        <div className="col-12 col-lg-5 text-center">
          <div className="position-relative mx-auto" style={{ maxWidth: '380px' }}>
            {/* Ambient Background Aura */}
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle, ${slide.color} 0%, rgba(16, 185, 129, 0) 70%)`,
                opacity: 0.35,
                filter: 'blur(35px)',
                zIndex: 0
              }}
            />

            {/* Organic Morphing Container */}
            <div
              key={`img-wrap-${current}`}
              className="morph-shape-wrapper overflow-hidden shadow-2xl position-relative border border-3 border-white animate-fade-in"
              style={{
                width: '340px',
                height: '340px',
                margin: '0 auto',
                borderRadius: current === 0
                  ? '62% 38% 70% 30% / 45% 58% 42% 55%'
                  : (current === 1 ? '38% 62% 45% 55% / 65% 35% 65% 35%' : '50% 50% 33% 67% / 55% 27% 73% 45%'),
                transition: 'border-radius 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 1
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-100 h-100 object-fit-cover"
                style={{
                  transform: 'scale(1.05)',
                  transition: 'transform 0.6s ease'
                }}
              />
            </div>
          </div>

          {/* Morph Navigation Controls */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length)}
              className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '38px', height: '38px' }}
              title="Previous Morph Slide"
              aria-label="Previous Slide"
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {/* Slide Dots */}
            <div className="d-flex gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  className="btn p-0 border-0"
                  style={{
                    width: current === idx ? '26px' : '10px',
                    height: '10px',
                    borderRadius: '9999px',
                    backgroundColor: current === idx ? '#10b981' : 'var(--border-subtle)',
                    transition: 'all 0.3s ease'
                  }}
                  title={`Go to slide ${idx + 1}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrent(prev => (prev + 1) % SLIDES.length)}
              className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '38px', height: '38px' }}
              title="Next Morph Slide"
              aria-label="Next Slide"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
