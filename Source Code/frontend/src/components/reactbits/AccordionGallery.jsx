import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PANELS = [
  {
    id: 'panel_01',
    title: 'Green Valley Farmstead',
    subtitle: 'Heirloom Tomatoes & Root Vegetables',
    grower: 'John Peterson',
    badge: '4th Gen Organic',
    quote: '"We cultivate living soil so every bite delivers authentic heirloom flavor."',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    link: '/products'
  },
  {
    id: 'panel_02',
    title: 'Sunny Meadow Orchards',
    subtitle: 'Vine-Ripened Albion Berries & Peaches',
    grower: 'Sarah Jenkins',
    badge: 'Sunrise Picked',
    quote: '"Harvested at 5:30 AM before sunrise so the natural sugars stay locked in."',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    link: '/products'
  },
  {
    id: 'panel_03',
    title: 'Artisan Apiary & Bakeshop',
    subtitle: 'Wildflower Combs & 36h Sourdough',
    grower: 'Miguel Alvarez',
    badge: 'Raw & Natural',
    quote: '"Our bees feed on wild sage and hillside blossoms without synthetic treatments."',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    link: '/products'
  },
  {
    id: 'panel_04',
    title: 'Weekend Farmers Pavilion',
    subtitle: 'Hyperlocal Neighborhood Pickup',
    grower: 'Community Hub',
    badge: '0% Middleman Cut',
    quote: '"Shake the hands of the families who grew your weekly food basket."',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
    link: '/markets'
  },
  {
    id: 'panel_05',
    title: 'Zero Waste Bio Logistics',
    subtitle: '100% Compostable Harvest Hampers',
    grower: 'Eco Standard',
    badge: 'Zero Single-Use',
    quote: '"From dawn picking to your kitchen counter with zero single-use plastic waste."',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    link: '/about'
  }
];

export default function AccordionGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="accordion-gallery-wrapper w-100 my-4">
      {/* Horizontal Flex Accordion Container */}
      <div
        className="d-flex flex-column flex-lg-row gap-3 rounded-5 overflow-hidden p-2"
        style={{
          minHeight: '440px',
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--card-border-glow, rgba(16, 185, 129, 0.25))',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.12), 0 0 25px rgba(16, 185, 129, 0.12)'
        }}
      >
        {PANELS.map((panel, idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={panel.id}
              onClick={() => setActiveIdx(idx)}
              onMouseEnter={() => setActiveIdx(idx)}
              className="accordion-panel position-relative rounded-4 overflow-hidden"
              style={{
                flex: isActive ? '3.5' : '1',
                minHeight: '260px',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scale(1)' : 'scale(0.985)'
              }}
            >
              {/* Background Full-bleed Image with Fallback */}
              <img
                src={panel.image}
                alt={panel.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
                }}
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                style={{
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                  filter: isActive ? 'brightness(0.9)' : 'brightness(0.65)',
                  transition: 'transform 0.6s ease, filter 0.4s ease'
                }}
              />

              {/* Gradient Dark Overlay */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background: 'linear-gradient(to top, rgba(5, 15, 10, 0.92) 0%, rgba(5, 15, 10, 0.35) 60%, rgba(0,0,0,0.15) 100%)',
                  zIndex: 1
                }}
              />

              {/* Panel Content */}
              <div className="position-relative h-100 p-4 d-flex flex-column justify-content-between" style={{ zIndex: 2 }}>
                {/* Top Badge */}
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="badge rounded-pill fw-bold text-white shadow-xs px-2.5 py-1"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.25)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.04em',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {panel.badge}
                  </span>
                  <span className="text-white-50 fw-bold small" style={{ fontSize: '0.74rem' }}>
                    0{idx + 1}
                  </span>
                </div>

                {/* Bottom Narrative / Info */}
                <div className="mt-auto text-white">
                  <div className="small text-success-emphasis fw-bold mb-1" style={{ fontSize: '0.76rem', color: '#6ee7b7' }}>
                    🧑‍🌾 {panel.grower}
                  </div>
                  <h4 className="fw-extrabold mb-1 font-heading text-white" style={{ fontSize: isActive ? '1.35rem' : '1.05rem', transition: 'font-size 0.3s ease' }}>
                    {panel.title}
                  </h4>

                  {isActive && (
                    <div className="animate-fade-in mt-2">
                      <div className="small text-white-50 mb-2" style={{ fontSize: '0.82rem' }}>
                        {panel.subtitle}
                      </div>
                      <p className="fst-italic small text-light opacity-90 mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                        {panel.quote}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(panel.link);
                        }}
                        className="btn btn-sm btn-egreen rounded-pill px-3 py-1.5 shadow-sm"
                        style={{ fontSize: '0.76rem' }}
                      >
                        Explore Stall Story →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
