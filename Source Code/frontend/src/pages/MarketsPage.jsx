import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketMap from '../components/map/MarketMap';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import TextMorph from '../components/reactbits/TextMorph';
import ParticleText from '../components/reactbits/ParticleText';
import ShaderCard from '../components/reactbits/ShaderCard';
import { api } from '../services/api';

import fallbackData from '../data/fallbackData.json';

const DAYS = ['All', 'Saturday', 'Sunday', 'Wednesday', 'Tuesday', 'Friday'];

function filterFallbackMarkets(list, day, query) {
  let filtered = [...(list || [])];
  if (day && day !== 'All') {
    filtered = filtered.filter(m => m.operatingDays && m.operatingDays.includes(day));
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(m =>
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.location && m.location.address && m.location.address.toLowerCase().includes(q))
    );
  }
  return filtered;
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState(() => fallbackData.markets || []);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedDay, setSelectedDay] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const data = await api.getMarkets({
          day: selectedDay !== 'All' ? selectedDay : undefined,
          search: searchQuery || undefined
        });
        if (data && data.length > 0) {
          setMarkets(data);
        } else {
          setMarkets(filterFallbackMarkets(fallbackData.markets, selectedDay, searchQuery));
        }
      } catch (err) {
        console.warn('Network request failed for markets, using fallback:', err);
        setMarkets(filterFallbackMarkets(fallbackData.markets, selectedDay, searchQuery));
      } finally {
        setLoading(false);
      }
    }
    fetchMarkets();
  }, [selectedDay, searchQuery]);

  return (
    <div className="container py-5">
      {/* Particle Text Banner */}
      <div className="text-center mb-2">
        <ParticleText text="REGIONAL HUBS" color="#10b981" fontSize={42} height={70} />
      </div>

      {/* Header */}
      <ScrollReveal animation="pop-up">
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2">
            REGIONAL HUBS • OPENSTREETMAP POWERED
          </span>
          <h1 className="display-5 fw-bold mb-2">
            Explore Certified{' '}
            <TextMorph
              words={[
                'Farmers Markets 📍',
                'Organic Pavilions 🌿',
                'Eco Community Stalls 🧺',
                'Fresh Food Hubs 🥑'
              ]}
              className="text-success font-heading"
            />
          </h1>
          <p className="text-muted">
            Locate nearby weekend and weekday farmers markets, find accurate stall coordinates, operating hours, and turn-by-turn pickup navigation.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter Bar with Glow Focus */}
      <div className="card p-4 mb-4 shadow-sm border rounded-4 position-relative" style={{ background: 'var(--card-bg)' }}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text border-end-0 text-muted" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-subtle)' }}>
                <i className="bi bi-search text-success"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by market name, city, or street address..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all ${
                    selectedDay === day 
                      ? 'btn-egreen text-white shadow-sm' 
                      : 'btn-outline-secondary border'
                  }`}
                  style={{ fontSize: '0.82rem' }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <ScrollReveal animation="scale-in">
        <div className="mb-5 shadow-sm rounded-4 overflow-hidden border" style={{ borderColor: 'var(--card-border-glow)' }}>
          <MarketMap 
            markets={markets} 
            selectedMarket={selectedMarket} 
            onSelectMarket={(m) => setSelectedMarket(m)} 
          />
        </div>
      </ScrollReveal>

      {/* Market Cards Grid */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0 font-heading">
          Participating Farmers Markets <span className="text-success">({markets.length})</span>
        </h3>
        <span className="small text-muted">Click any stall card for full farmer roster</span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="small text-muted mt-2">Loading verified markets...</p>
        </div>
      ) : markets.length === 0 ? (
        <div className="text-center py-5 card rounded-4 border p-4" style={{ background: 'var(--card-bg)' }}>
          <div className="fs-1 mb-2">📍</div>
          <h5 className="fw-bold">No markets found for "{searchQuery || selectedDay}"</h5>
          <p className="text-muted small">Try selecting "All" days or broadening your search keywords.</p>
        </div>
      ) : (
        <div className="row g-4">
          {markets.map((m, idx) => (
            <div key={m._id} className="col-12 col-md-6 col-lg-4">
              <ScrollReveal animation="pop-up" delay={idx * 80}>
                <SpotlightCard className="h-100 d-flex flex-column overflow-hidden">
                  <div className="position-relative" style={{ height: '190px' }}>
                    <img 
                      src={m.image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'} 
                      alt={m.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge rounded-pill fw-bold text-white shadow-xs" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.72rem' }}>
                        {m.city || 'California'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold mb-1 font-heading">{m.name}</h5>
                    <p className="small text-muted mb-2">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {m.address}
                    </p>

                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1 small">
                        🕒 {m.timings}
                      </span>
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-2.5 py-1 small">
                        📅 {(m.operatingDays || []).join(', ')}
                      </span>
                    </div>

                    <p className="small text-secondary mb-4 flex-grow-1" style={{ lineHeight: '1.5' }}>
                      {m.description || 'Vibrant outdoor market featuring certified organic produce, fresh baked goods, and live farmer stalls.'}
                    </p>

                    <div className="d-flex gap-2 pt-3 border-top mt-auto">
                      <Link 
                        to={`/markets/${m._id}`} 
                        className="btn btn-sm btn-egreen flex-grow-1 rounded-pill py-2"
                      >
                        View Stalls & Stock →
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSelectedMarket(m)}
                        className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '36px', height: '36px' }}
                        title="Focus on Map"
                      >
                        <i className="bi bi-crosshair"></i>
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}

      {/* Extended Market Spotlight & Visitor Guidelines */}
      <div className="mt-5 pt-4 border-top">
        <div className="row g-4 mb-5">
          <div className="col-12 col-lg-5">
            <ShaderCard
              title="Downtown Green Farmers Market"
              subtitle="Premier Regional Agriculture Hub"
              badge="🌟 Stall of Excellence 2026"
              glowColor="#059669"
              className="h-100"
            >
              <p className="mb-3" style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Over 45 family farms assemble every Saturday and Sunday morning at the Embarcadero Ferry Plaza. Features on-site woodfired bakers, raw hillside beekeepers, and fresh wild berry growers.
              </p>
              <div className="d-flex flex-column gap-2 small mb-3 p-3 rounded-3" style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(6px)' }}>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock-fill text-success"></i>
                  <span style={{ color: '#ffffff' }}><strong style={{ color: '#6ee7b7' }}>Peak Morning:</strong> 08:00 AM – 11:30 AM (Best selection)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-p-square-fill text-info"></i>
                  <span style={{ color: '#ffffff' }}><strong style={{ color: '#93c5fd' }}>Dedicated Parking:</strong> Underground garage with 2 hrs validated</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-credit-card-2-front-fill text-warning"></i>
                  <span style={{ color: '#ffffff' }}><strong style={{ color: '#fde047' }}>Payment:</strong> Cash, Cards, Apple/Google Pay, EBT / SNAP</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-egreen w-100 rounded-pill py-2.5 fw-bold shadow-sm"
                onClick={() => {
                  if (markets.length > 0) setSelectedMarket(markets[0]);
                }}
              >
                <i className="bi bi-geo-alt me-1"></i> Highlight on Interactive Map
              </button>
            </ShaderCard>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card p-4 rounded-4 border h-100" style={{ background: 'var(--card-bg)' }}>
              <h5 className="fw-bold mb-3 font-heading">
                <span className="text-success me-2">📋</span> Market Visitor Etiquette & FAQ
              </h5>

              <div className="accordion accordion-flush" id="marketFaqAccordion">
                <div className="accordion-item border-0 border-bottom mb-2" style={{ background: 'transparent' }}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#mfaq1" style={{ background: 'transparent' }}>
                      How does the 0% online pre-ordering fee work?
                    </button>
                  </h2>
                  <div id="mfaq1" className="accordion-collapse collapse" data-bs-parent="#marketFaqAccordion">
                    <div className="accordion-body px-0 text-secondary small">
                      You can build your harvest cart throughout the week with $0 upfront payment. The farmer receives your packing slip and sets aside your produce. You simply arrive at the stall during your chosen morning pickup slot, inspect the crate, and pay the farmer in-person.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 border-bottom mb-2" style={{ background: 'transparent' }}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#mfaq2" style={{ background: 'transparent' }}>
                      Are domestic pets and service animals welcome?
                    </button>
                  </h2>
                  <div id="mfaq2" className="accordion-collapse collapse" data-bs-parent="#marketFaqAccordion">
                    <div className="accordion-body px-0 text-secondary small">
                      Leashed, friendly dogs and certified service animals are welcome in outdoor walkway aisles! We provide fresh water bowls at the community info tent.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 border-bottom mb-2" style={{ background: 'transparent' }}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#mfaq3" style={{ background: 'transparent' }}>
                      Can I bring my own reusable produce totes & baskets?
                    </button>
                  </h2>
                  <div id="mfaq3" className="accordion-collapse collapse" data-bs-parent="#marketFaqAccordion">
                    <div className="accordion-body px-0 text-secondary small">
                      Yes! MarketLink strongly advocates for zero single-use plastics. Many stallholders offer a $0.25 reusable bag discount on bulk produce.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0" style={{ background: 'transparent' }}>
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#mfaq4" style={{ background: 'transparent' }}>
                      What happens if rain occurs on market day?
                    </button>
                  </h2>
                  <div id="mfaq4" className="accordion-collapse collapse" data-bs-parent="#marketFaqAccordion">
                    <div className="accordion-body px-0 text-secondary small">
                      All partner pavilions operate rain or shine! Stalls are equipped with weather-proof canopies. If severe storms cause official closures, pre-orders are automatically rescheduled or refunded.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
