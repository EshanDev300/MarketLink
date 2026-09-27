import React, { useState } from 'react';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import TextMorph from '../components/reactbits/TextMorph';
import ParticleText from '../components/reactbits/ParticleText';
import ShaderCard from '../components/reactbits/ShaderCard';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does in-person pickup and pre-ordering work?',
      a: 'You browse live weekly inventory listed by certified local farmers and add produce to your cart. At checkout, you pick a morning pickup window. You pay $0 online! When you arrive at the farmers market stall on harvest day, your fresh crate is ready. You inspect your produce and pay the farmer directly via cash, card, or phone.'
    },
    {
      q: 'Why are there no online payment fees?',
      a: 'MarketLink was designed for direct agricultural commerce. Traditional payment gateways extract 3-5% from farmers’ margins. By settling in-person at pickup, 100% of your dollars stay with the grower, while you avoid credit card processing surcharges.'
    },
    {
      q: 'When are harvests harvested and updated?',
      a: 'Farmers update their available harvest yields by Friday afternoon. Produce is picked either at sunrise on market day or the afternoon prior, ensuring maximum nutrient density and peak flavor.'
    },
    {
      q: 'How does the Gemini AI Market Assistant help me?',
      a: 'MarketLink features built-in Gemini 3.8 AI intelligence. You can ask natural language questions 24/7 about produce availability, pickup times, seasonal recipes, market directions, and farm sustainability practices.'
    }
  ];

  return (
    <div className="container py-5">
      {/* Particle Text Banner */}
      <div className="text-center mb-2">
        <ParticleText text="OUR STORY" color="#10b981" fontSize={42} height={70} />
      </div>

      {/* Header */}
      <ScrollReveal animation="pop-up">
        <div className="text-center max-w-xl mx-auto mb-5">
          <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2 shadow-xs">
            THE eGREEN BASKET STORY • TECHWIZ 7
          </span>
          <h1 className="display-5 fw-bold mb-3">
            About{' '}
            <TextMorph
              words={[
                'MarketLink 🌿',
                'eGreen Basket 🧺',
                'Fair Agriculture 🚜',
                'Pure Food Loops 🥑'
              ]}
              className="text-success font-heading"
            />
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            Bridging the gap between certified organic growers and conscious communities through predictable pre-order transparency.
          </p>
        </div>
      </ScrollReveal>

      {/* Mission Section */}
      <ScrollReveal animation="pop-up" delay={100}>
        <div className="card p-4 p-lg-5 mb-5 border rounded-4 shadow-sm" style={{ background: 'var(--card-bg)' }}>
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-6">
              <h3 className="fw-bold mb-3 font-heading">Farm Fresh Just a Click Away</h3>
              <p className="text-secondary" style={{ lineHeight: '1.75' }}>
                Farmers markets are vibrant centers of seasonal, nutrient-dense nutrition. However, traditional market visits often suffer from uncertainty: customers arrive only to discover high-demand berries, heirloom squash, or sourdough already sold out, or finding that a grower could not make the trip.
              </p>
              <p className="text-secondary" style={{ lineHeight: '1.75' }}>
                <strong>MarketLink</strong> solves this by centralizing weekly grower availability, inventory levels, and pre-orders. Farmers accurately predict their Friday harvests, minimize post-harvest food waste, and reserve packed baskets for customer pickup on market morning.
              </p>
              <div className="d-flex gap-3 pt-2">
                <div className="badge-glow px-3 py-2 rounded-pill small fw-semibold">
                  🌱 0% Middleman Fees
                </div>
                <div className="badge-glow px-3 py-2 rounded-pill small fw-semibold">
                  ☀️ Sunrise Harvests
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="rounded-4 overflow-hidden shadow-sm position-relative" style={{ height: '340px' }}>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Farmers market crate"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 m-3 p-2 px-3 rounded-pill bg-dark bg-opacity-75 text-white small">
                  📍 Certified Organic Farmstead Partner
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Pillars */}
      <ScrollReveal animation="pop-up">
        <h3 className="fw-bold mb-4 text-center font-heading">Core Platform Pillars</h3>
      </ScrollReveal>
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <ScrollReveal animation="pop-up" delay={100}>
            <SpotlightCard className="p-4 h-100 border">
              <div className="fs-1 text-success mb-2">🌿</div>
              <h5 className="fw-bold mb-2 font-heading">Zero Food Waste</h5>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                Farmers only harvest what has been committed through pre-orders, preventing surplus disposal at the end of hot market days.
              </p>
            </SpotlightCard>
          </ScrollReveal>
        </div>
        <div className="col-12 col-md-4">
          <ScrollReveal animation="pop-up" delay={200}>
            <SpotlightCard className="p-4 h-100 border">
              <div className="fs-1 text-success mb-2">🤝</div>
              <h5 className="fw-bold mb-2 font-heading">Fair Direct Trade</h5>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                No middleman or payment gateway deduction. Customers settle payment directly in-person with the grower at the stall.
              </p>
            </SpotlightCard>
          </ScrollReveal>
        </div>
        <div className="col-12 col-md-4">
          <ScrollReveal animation="pop-up" delay={300}>
            <SpotlightCard className="p-4 h-100 border">
              <div className="fs-1 text-success mb-2">📍</div>
              <h5 className="fw-bold mb-2 font-heading">Hyperlocal Map Precision</h5>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                OpenStreetMap integration with exact coordinates, operating schedules, and directions for every community market.
              </p>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>

      {/* Sustainability Impact & Shader Card Section */}
      <div className="row g-4 mb-5 align-items-stretch">
        <div className="col-12 col-lg-5">
          <ShaderCard
            title="The 15-Mile Food Loop"
            subtitle="Eliminating Industrial Supply Chains"
            badge="🌎 Carbon Footprint Minus 84%"
            glowColor="#10b981"
            className="h-100"
          >
            <p className="small text-secondary mb-3">
              Standard supermarket produce travels an average of 1,500 miles from industrial mega-farms, sitting in refrigerated shipping containers for weeks.
            </p>
            <div className="p-3 bg-body-tertiary rounded-3 border mb-3 small">
              <div className="d-flex justify-content-between mb-1.5">
                <span>Supermarket Produce Transit:</span>
                <strong className="text-danger">1,500 Miles</strong>
              </div>
              <div className="d-flex justify-content-between mb-1.5">
                <span>MarketLink Farm to Stall:</span>
                <strong className="text-success">&lt; 18 Miles</strong>
              </div>
              <div className="d-flex justify-content-between border-top pt-1.5">
                <span>Nutrient Degradation:</span>
                <strong className="text-success">-0% (Sunrise Picked)</strong>
              </div>
            </div>
            <div className="small text-muted">
              By reserving produce directly through our pre-order platform, you keep food dollars local and regenerate regional topsoil.
            </div>
          </ShaderCard>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card p-4 rounded-4 border h-100" style={{ background: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3 font-heading">
              <span className="text-success me-2">🌱</span> Certified Grower Charter & Standards
            </h5>
            <p className="small text-secondary mb-3">
              Every farmer and artisan baker on MarketLink undergoes verified seasonal inspection to ensure adherence to ecological growing standards:
            </p>

            <div className="d-flex flex-column gap-2.5">
              <div className="p-2.5 rounded-3 bg-body-tertiary border d-flex align-items-start gap-2.5">
                <span className="fs-5 text-success">🌾</span>
                <div>
                  <strong className="small d-block text-dark-emphasis">Living Soil Biology</strong>
                  <span className="small text-muted">Zero reliance on synthetic nitrogen fertilizers. Farms utilize cover cropping and vermiculture.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-3 bg-body-tertiary border d-flex align-items-start gap-2.5">
                <span className="fs-5 text-success">🐝</span>
                <div>
                  <strong className="small d-block text-dark-emphasis">Pollinator Protection Sanctuaries</strong>
                  <span className="small text-muted">Dedicated wildflower corridors on farm boundaries to nurture honeybee colonies and native pollinators.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-3 bg-body-tertiary border d-flex align-items-start gap-2.5">
                <span className="fs-5 text-success">💧</span>
                <div>
                  <strong className="small d-block text-dark-emphasis">Water Stewardship & Drip Conservation</strong>
                  <span className="small text-muted">Precision micro-drip irrigation that conserves over 60% of water compared to commercial sprayers.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <ScrollReveal animation="pop-up">
        <div className="card p-4 p-lg-5 mb-5 rounded-4 border shadow-sm" style={{ background: 'var(--card-bg)' }}>
          <div className="text-center mb-4">
            <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="fw-bold font-heading">Everything You Need to Know</h3>
          </div>

          <div className="d-flex flex-column gap-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-3 rounded-4 border transition-all cursor-pointer"
                style={{
                  background: openFaq === idx ? 'var(--mint-bg)' : 'var(--card-bg)',
                  borderColor: openFaq === idx ? 'var(--emerald-accent)' : 'var(--border-subtle)'
                }}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0 text-dark-emphasis">{faq.q}</h6>
                  <i className={`bi ${openFaq === idx ? 'bi-chevron-up text-success' : 'bi-chevron-down text-muted'}`}></i>
                </div>
                {openFaq === idx && (
                  <p className="small text-secondary mt-3 mb-0" style={{ lineHeight: '1.65' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* TechWiz Specifications & Badges */}
      <ScrollReveal animation="scale-in">
        <div className="p-4 p-lg-5 rounded-4 border shadow-xs" style={{ background: 'var(--card-bg)' }}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="badge bg-success p-2.5 rounded-3 fs-4 shadow-sm">🏆</div>
            <div>
              <h4 className="fw-bold mb-0 font-heading">Aptech TechWiz 7 Project</h4>
              <div className="text-muted small">Category: End-to-End Web Solutions • Theme: eGreen Basket</div>
            </div>
          </div>
          <p className="text-secondary small mb-3" style={{ lineHeight: '1.6' }}>
            Designed and engineered adhering to all functional and non-functional requirements specified in the MarketLink Software Requirements Specification (SRS Version 1.0).
          </p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge bg-body-tertiary text-success border px-3 py-2 rounded-pill">React 18 Architecture</span>
            <span className="badge bg-body-tertiary text-success border px-3 py-2 rounded-pill">Bootstrap 5 (Strictly No Tailwind)</span>
            <span className="badge bg-body-tertiary text-success border px-3 py-2 rounded-pill">Gemini 3.8 AI Assistant</span>
            <span className="badge bg-body-tertiary text-success border px-3 py-2 rounded-pill">3D Three.js Harvest Basket</span>
            <span className="badge bg-body-tertiary text-success border px-3 py-2 rounded-pill">OpenStreetMap Geolocation</span>
            <span className="badge bg-body-tertiary text-success border px-3 py-2 rounded-pill">ReactBits Depth & Magnet FX</span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
