import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DecryptedText from '../components/reactbits/DecryptedText';
import ShinyText from '../components/reactbits/ShinyText';
import MagnetButton from '../components/reactbits/MagnetButton';
import TextMorph from '../components/reactbits/TextMorph';
import GradientCarousel from '../components/reactbits/GradientCarousel';
import DepthCard from '../components/reactbits/DepthCard';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import { BentoGrid, BentoItem } from '../components/reactbits/BentoGrid';
import CounterNumber from '../components/reactbits/CounterNumber';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import OrganicBasket3D from '../components/three/OrganicBasket3D';
import MarketMap from '../components/map/MarketMap';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import InteractiveGlobe from '../components/reactbits/InteractiveGlobe';
import ShaderCard from '../components/reactbits/ShaderCard';
import MorphSlider from '../components/reactbits/MorphSlider';
import AccordionGallery from '../components/reactbits/AccordionGallery';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [telemetryMode, setTelemetryMode] = useState('harvest');

  const telemetryData = {
    harvest: {
      badge: 'SUNRISE HARVEST',
      title: 'Field Freshness Telemetry',
      highlight: 'Picked at dawn • Zero cold storage degradation',
      metric1: '98% Moisture Retention',
      metric2: '62°F Morning Mist Temp',
      metric3: '34 Regional Stalls Active',
      status: 'Live Freshness 99.8%'
    },
    crates: {
      badge: 'ARTISAN PAIRINGS',
      title: 'Small Batch Hampers',
      highlight: 'Hand-bundled organic produce & 36h sourdough',
      metric1: '100% Biodegradable Baskets',
      metric2: 'Zero Microplastics Used',
      metric3: '18 Certified Family Apiaries',
      status: 'Ready for Weekend Pickup'
    },
    soil: {
      badge: 'REGENERATIVE SOIL',
      title: 'CCOF Certified Provenance',
      highlight: 'Organic composted soil • Zero chemical runoff',
      metric1: 'Rich Microbiome Soil',
      metric2: '0 Synthetic Pesticides',
      metric3: '4 Verified Market Hubs',
      status: '100% True Traceability'
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await api.getProducts({ inStockOnly: 'true' });
        setFeaturedProducts(prods.slice(0, 8));

        const mkts = await api.getMarkets();
        setMarkets(mkts.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  // Curated Signature Farm Crates for 3D Depth Cards
  const curatedCrates = [
    {
      id: 'crate_01',
      title: 'Sunrise Orchard & Berry Crate',
      subtitle: 'Hand-Picked at Dawn',
      badge: 'Bestseller',
      price: '$24.50',
      rating: '4.9 ★ (42)',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      tags: ['Organic Strawberries', 'Honeycrisp Apples', 'Meyer Lemons'],
      desc: 'Sweet, juicy seasonal fruits gathered from Sunny Meadow Orchards.'
    },
    {
      id: 'crate_02',
      title: "Chef's Heirloom Garden Harvest",
      subtitle: 'Zero Synthetic Sprays',
      badge: 'Harvest Fresh',
      price: '$28.00',
      rating: '5.0 ★ (58)',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      tags: ['Brandywine Tomatoes', 'Golden Chanterelles', 'Rainbow Carrots'],
      desc: 'Crisp, peppery greens, colorful root veggies, and wild culinary mushrooms.'
    },
    {
      id: 'crate_03',
      title: 'Artisan Bakery & Apiary Hamper',
      subtitle: 'Handcrafted Small Batch',
      badge: 'Farmstead',
      price: '$32.00',
      rating: '4.9 ★ (36)',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      tags: ['36hr Sourdough', 'Raw Creamed Honey', 'Pasture Butter'],
      desc: 'Crusty mahogany sourdough loaves paired with raw honeycomb from hillside hives.'
    }
  ];

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-wrapper position-relative">
        <div className="aurora-bg-container" />
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            {/* Left Column: Headlines & CTA */}
            <div className="col-12 col-lg-7">
              <ScrollReveal animation="slide-left" delay={50}>
                <div className="hero-tag">
                  <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
                  <span>eGreen Basket • TechWiz 7 Championship Platform</span>
                </div>

                <h1 className="display-4 fw-extrabold mb-3" style={{ lineHeight: '1.18' }}>
                  <DecryptedText 
                    text="Farm Fresh" 
                    speed={50} 
                    maxIterations={8} 
                    className="text-success"
                  />{' '}
                  <span className="d-block mt-1">
                    <TextMorph 
                      words={[
                        'Picked at Sunrise ☀️',
                        'Zero Middleman Markups 🌿',
                        'Direct From Local Stalls 🧑‍🌾',
                        'Pure Organic Goodness 🥑',
                        'Just a Click Away 🧺'
                      ]}
                      className="text-success font-heading"
                    />
                  </span>
                </h1>

                <div className="fs-5 fw-semibold mb-3">
                  <ShinyText text="Reserve your weekly harvest online — Settle and pickup at your favorite local farmers market stall." />
                </div>

                <p className="text-secondary mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.65' }}>
                  MarketLink connects certified organic growers directly with neighborhood food lovers. 
                  Say goodbye to sold-out produce chalkboards and wasted market trips. 
                  Browse live weekly inventories, reserve your fresh basket with 0% gateway cuts, and meet the growers in person.
                </p>

                {/* Action Buttons with Glowing Effects */}
                <div className="d-flex flex-wrap gap-3 mb-5">
                  <MagnetButton onClick={() => navigate('/products')}>
                    <i className="bi bi-basket-fill"></i> Browse Harvest Catalog
                  </MagnetButton>
                  <button
                    type="button"
                    onClick={() => navigate('/markets')}
                    className="btn btn-egreen-outline px-4 py-2"
                  >
                    <i className="bi bi-geo-alt-fill"></i> View Markets & Map
                  </button>
                </div>

                {/* Live Metric Counters */}
                <div className="row g-3 pt-4 border-top">
                  <div className="col-4">
                    <div className="fs-3 fw-bold text-success font-heading">
                      <CounterNumber end={30} suffix="+" />
                    </div>
                    <div className="small text-muted fw-semibold">Local Farmers</div>
                  </div>
                  <div className="col-4">
                    <div className="fs-3 fw-bold text-success font-heading">
                      <CounterNumber end={4} suffix=" Hubs" />
                    </div>
                    <div className="small text-muted fw-semibold">Weekly Markets</div>
                  </div>
                  <div className="col-4">
                    <div className="fs-3 fw-bold text-success font-heading">
                      <CounterNumber end={100} prefix="" suffix="%" />
                    </div>
                    <div className="small text-muted fw-semibold">Fair Trade In-Person</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Three.js Interactive 3D Basket with Live Telemetry Badges & Radar HUD */}
            <div className="col-12 col-lg-5 text-center">
              <ScrollReveal animation="pop-up" delay={150}>
                <div className="position-relative p-2">
                  {/* Floating Holographic Telemetry Badges around the 3D Basket */}
                  <div className="telemetry-badge telemetry-badge-tl d-none d-sm-flex">
                    <span className="pulse-emerald-dot"></span>
                    <div>
                      <div className="text-muted fw-bold" style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>SUNRISE PICK</div>
                      <div className="fw-bold text-success small">Harvested 3.5h Ago</div>
                    </div>
                  </div>

                  <div className="telemetry-badge telemetry-badge-tr d-none d-sm-flex">
                    <i className="bi bi-shield-fill-check text-success fs-5"></i>
                    <div>
                      <div className="text-muted fw-bold" style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>CERTIFIED SOIL</div>
                      <div className="fw-bold text-dark-emphasis small">100% CCOF Organic</div>
                    </div>
                  </div>

                  <div className="telemetry-badge telemetry-badge-br d-none d-sm-flex">
                    <i className="bi bi-geo-alt-fill text-warning fs-5"></i>
                    <div>
                      <div className="text-muted fw-bold" style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>PROVENANCE</div>
                      <div className="fw-bold text-dark-emphasis small">0 Food Miles Direct</div>
                    </div>
                  </div>

                  <div className="telemetry-badge telemetry-badge-bl d-none d-sm-flex">
                    <i className="bi bi-patch-check-fill text-info fs-5"></i>
                    <div>
                      <div className="text-muted fw-bold" style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>INTEGRITY</div>
                      <div className="fw-bold text-dark-emphasis small">0% Platform Surcharge</div>
                    </div>
                  </div>

                  {/* 3D Basket Canvas */}
                  <OrganicBasket3D />

                  <div className="badge bg-white text-success border border-success-subtle shadow-sm px-3 py-1.5 rounded-pill mt-2">
                    ✨ Interactive 3D Basket — Move Cursor to Tilt
                  </div>

                  {/* Interactive Live Harvest Radar HUD */}
                  <div className="hero-telemetry-hud mt-3 text-start">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
                        <span className="fw-bold small text-success font-heading" style={{ fontSize: '0.85rem' }}>
                          {telemetryData[telemetryMode].title}
                        </span>
                      </div>
                      <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                        {telemetryData[telemetryMode].status}
                      </span>
                    </div>

                    <p className="text-secondary small mb-2" style={{ fontSize: '0.78rem' }}>
                      {telemetryData[telemetryMode].highlight}
                    </p>

                    {/* Interactive Mode Tabs */}
                    <div className="d-flex gap-1.5 mb-2.5">
                      <button
                        type="button"
                        onClick={() => setTelemetryMode('harvest')}
                        className={`btn btn-sm rounded-pill px-2.5 py-0.5 fw-semibold ${telemetryMode === 'harvest' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        🌿 Sunrise Harvest
                      </button>
                      <button
                        type="button"
                        onClick={() => setTelemetryMode('crates')}
                        className={`btn btn-sm rounded-pill px-2.5 py-0.5 fw-semibold ${telemetryMode === 'crates' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        🍯 Artisan Hampers
                      </button>
                      <button
                        type="button"
                        onClick={() => setTelemetryMode('soil')}
                        className={`btn btn-sm rounded-pill px-2.5 py-0.5 fw-semibold ${telemetryMode === 'soil' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        🌱 Regenerative Soil
                      </button>
                    </div>

                    {/* Live Metric Pills */}
                    <div className="row g-2 pt-2 border-top">
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>HYDRATION</div>
                        <div className="fw-bold small text-dark-emphasis text-truncate" style={{ fontSize: '0.74rem' }}>
                          {telemetryData[telemetryMode].metric1}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>FIELD TEMP</div>
                        <div className="fw-bold small text-dark-emphasis text-truncate" style={{ fontSize: '0.74rem' }}>
                          {telemetryData[telemetryMode].metric2}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>REGIONAL HUBS</div>
                        <div className="fw-bold small text-dark-emphasis text-truncate" style={{ fontSize: '0.74rem' }}>
                          {telemetryData[telemetryMode].metric3}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ReactBits Pro Infinite Gradient Carousel */}
      <section className="py-2 border-top border-bottom" style={{ background: 'var(--card-bg)' }}>
        <GradientCarousel speed={30} />
      </section>

      {/* Curated Depth Cards Showcase: Signature Crates */}
      <section className="py-5" style={{ background: 'var(--body-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="text-center max-w-xl mx-auto mb-5">
              <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
                FARMSTEAD CRATES
              </span>
              <h2 className="display-6 fw-bold">Curated 3D Harvest Hampers</h2>
              <p className="text-muted">
                Hand-picked combinations from our top regional growers, ready for weekend market pickup.
              </p>
            </div>
          </ScrollReveal>

          <div className="row g-4">
            {curatedCrates.map((crate, idx) => (
              <div key={crate.id} className="col-12 col-md-4">
                <ScrollReveal animation="pop-up" delay={idx * 120}>
                  <DepthCard
                    image={crate.image}
                    title={crate.title}
                    subtitle={crate.subtitle}
                    badge={crate.badge}
                    price={crate.price}
                    rating={crate.rating}
                    tags={crate.tags}
                  >
                    <p className="small text-muted mb-3 mt-2">{crate.desc}</p>
                    <button
                      type="button"
                      className="btn btn-sm btn-egreen w-100 rounded-pill py-2"
                      onClick={() => navigate('/products')}
                    >
                      <i className="bi bi-bag-check-fill me-1"></i> Pre-Order Crate
                    </button>
                  </DepthCard>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ReactBits Morph Slider: Curated Seasonal Collections */}
      <section className="py-5" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="text-center max-w-xl mx-auto mb-4">
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2">
                DYNAMIC MORPH SLIDER • FARMSTEAD COLLECTIONS
              </span>
              <h2 className="display-6 fw-bold font-heading">Interactive Seasonal Morph Slider</h2>
              <p className="text-muted">
                Explore hand-bundled artisan hampers with smooth organic transitions and direct farm-to-table traceability.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale-in" delay={100}>
            <MorphSlider />
          </ScrollReveal>
        </div>
      </section>

      {/* Bento Grid: Ecosystem Highlights */}
      <section className="py-5" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="text-center max-w-xl mx-auto mb-5">
              <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
                WHY MARKETLINK?
              </span>
              <h2 className="display-6 fw-bold">The Sustainable Farm-to-Fork Loop</h2>
              <p className="text-muted">A dedicated platform addressing the real-world friction of local agricultural commerce.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale-in">
            <BentoGrid>
              {/* Bento 1: Stock Transparency */}
              <BentoItem col={8} className="p-4 bg-light">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded-circle bg-success text-white fs-4 shadow-sm">
                    🌱
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">Live Weekly Inventory Visibility</h4>
                    <div className="text-muted small">Updated directly by growers prior to harvest day</div>
                  </div>
                </div>
                <p className="text-secondary mb-0">
                  Farmers configure their weekly recurring stock templates, updating crop yields each Friday. Shoppers never arrive to find their favorite heirloom tomatoes or sourdough sold out.
                </p>
              </BentoItem>

              {/* Bento 2: Zero Online Gateway Fees */}
              <BentoItem col={4} className="p-4" style={{ backgroundColor: 'var(--mint-bg)' }}>
                <div className="fs-1 mb-2">💵</div>
                <h5 className="fw-bold text-success">Pay at Market Pickup</h5>
                <p className="small text-muted mb-0">
                  No third-party payment gateway cuts. Pre-order online to reserve your crate, and pay in-person at the farm stall with cash, card, or phone.
                </p>
              </BentoItem>

              {/* Bento 3: Interactive OpenStreetMap */}
              <BentoItem col={4} className="p-4 bg-light">
                <div className="fs-1 mb-2">🗺️</div>
                <h5 className="fw-bold">Interactive Geolocation</h5>
                <p className="small text-muted mb-0">
                  Pinpoint stalls with precision coordinates, view operating days, timings, and get turn-by-turn directions right to the pickup spot.
                </p>
              </BentoItem>

              {/* Bento 4: AI Intelligent Assistant */}
              <BentoItem col={8} className="p-4" style={{ background: 'linear-gradient(135deg, var(--mint-bg), var(--card-bg))' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <span className="fs-2">🤖</span>
                  <h5 className="fw-bold mb-0">Gemini 3.8 AI Market Intelligence</h5>
                </div>
                <p className="small text-secondary mb-0">
                  Ask about weekend market timings, check produce availability in stock, or inquire about morning pickup windows 24/7.
                </p>
              </BentoItem>
            </BentoGrid>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Weekly Harvest Produce */}
      <section className="py-5" style={{ background: 'var(--body-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
              <div>
                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
                  SEASONAL HIGHLIGHTS
                </span>
                <h2 className="fw-bold mb-1">Freshly Harvested Produce</h2>
                <p className="text-muted mb-0">Reserve these popular items before the order cutoff time arrives.</p>
              </div>
              <Link to="/products" className="btn btn-egreen-outline rounded-pill mt-3 mt-md-0">
                View All Fresh Produce ({featuredProducts.length}+) →
              </Link>
            </div>
          </ScrollReveal>

          <div className="row g-4">
            {featuredProducts.map((prod, idx) => (
              <div key={prod._id} className="col-12 col-sm-6 col-lg-3">
                <ScrollReveal animation="pop-up" delay={idx * 60}>
                  <ProductCard 
                    product={prod} 
                    onOpenDetails={(p) => setSelectedProduct(p)} 
                  />
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Discovery Map Preview */}
      <section className="py-5" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="row align-items-center mb-4">
              <div className="col-12 col-md-8">
                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
                  COMMUNITY HUBS
                </span>
                <h2 className="fw-bold mb-1">Find Your Local Weekend Farmers Market</h2>
                <p className="text-muted mb-0">Explore stall locations, timings, and directions powered by OpenStreetMap.</p>
              </div>
              <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                <Link to="/markets" className="btn btn-egreen">
                  Open Full Market Directory →
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale-in" delay={100}>
            <MarketMap markets={markets} />
          </ScrollReveal>
        </div>
      </section>

      {/* ReactBits Pro 3D Interactive Globe & Regional Network */}
      <section className="py-5" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <ScrollReveal animation="slide-left">
                <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2">
                  HYPERLOCAL SUSTAINABILITY • 3D EARTH VIEW
                </span>
                <h2 className="display-6 fw-bold mb-3 font-heading">
                  Real-Time Regional Farm Connections
                </h2>
                <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
                  Our live agricultural matrix connects organic valley growers directly with Bay Area neighborhood hubs. Drag the 3D globe to view participating community markets, verified field coordinates, and seasonal produce distribution paths.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 rounded-4 border bg-body-tertiary">
                      <div className="fs-3 fw-bold text-success font-heading">
                        <CounterNumber end={25} suffix=" mi" />
                      </div>
                      <div className="small text-secondary fw-semibold">Average Farm-to-Fork Radius</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-4 border bg-body-tertiary">
                      <div className="fs-3 fw-bold text-success font-heading">
                        <CounterNumber end={100} suffix="%" />
                      </div>
                      <div className="small text-secondary fw-semibold">Certified Regional Soil</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/markets')}
                    className="btn btn-egreen rounded-pill px-4"
                  >
                    <i className="bi bi-geo-alt-fill me-1"></i> Locate Local Stalls
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className="btn btn-egreen-outline rounded-pill px-4"
                  >
                    View Harvest Catalog
                  </button>
                </div>
              </ScrollReveal>
            </div>

            <div className="col-12 col-lg-6 text-center">
              <ScrollReveal animation="pop-up" delay={150}>
                <InteractiveGlobe size={420} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ReactBits Pro Shader Card Showcase: Eco Protocol */}
      <section className="py-5" style={{ background: 'var(--body-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="text-center max-w-xl mx-auto mb-5">
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2">
                REVOLUTIONARY TECH • ZERO SURPLUS PROTOCOL
              </span>
              <h2 className="display-6 fw-bold font-heading">Procedural Shader & Eco Logistics</h2>
              <p className="text-muted">
                Experience the computational power optimizing fresh morning harvest routes with 0% platform extraction.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale-in">
            <ShaderCard
              title="Next-Gen Zero Waste Agricultural Pipeline"
              subtitle="Aptech TechWiz 7 Core SRS Architecture"
              badge="Algorithmic Sustainability"
              description="By synchronizing customer pre-orders with growers' Friday sunrise harvests, MarketLink completely eradicates the 30% unsold food waste typical of conventional grocery logistics."
              stats={[
                { label: 'Platform Fee', val: '$0.00' },
                { label: 'Harvest to Pickup', val: '< 6 hrs' },
                { label: 'Direct Grower Share', val: '100%' }
              ]}
            >
              <div className="mt-4 d-flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="btn btn-sm btn-light text-success fw-bold rounded-pill px-4 py-2 shadow-sm"
                >
                  <i className="bi bi-basket-fill me-1"></i> Pre-Order Weekend Harvest
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="btn btn-sm btn-outline-light rounded-pill px-4 py-2"
                >
                  Learn About The Loop →
                </button>
              </div>
            </ShaderCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ReactBits Accordion Gallery: Visual Farmstead & Pavilion Stories */}
      <section className="py-5" style={{ background: 'var(--card-bg)' }}>
        <div className="container">
          <ScrollReveal animation="pop-up">
            <div className="text-center max-w-xl mx-auto mb-4">
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2">
                EXPANDING VISUAL STORIES • INTERACTIVE ACCORDION
              </span>
              <h2 className="display-6 fw-bold font-heading">Meet the Fields & Growers</h2>
              <p className="text-muted">
                Hover or click each panoramic panel to reveal grower philosophies, morning harvesting routines, and stall locations.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale-in" delay={120}>
            <AccordionGallery />
          </ScrollReveal>
        </div>
      </section>

      {/* How it Works: 3 Simple Steps */}
      <section className="py-5" style={{ background: 'var(--mint-bg)' }}>
        <div className="container text-center">
          <ScrollReveal animation="pop-up">
            <span className="badge bg-success text-white px-3 py-1 rounded-pill fw-semibold mb-2">
              SIMPLE WORKFLOW
            </span>
            <h2 className="fw-bold mb-4">How MarketLink Works for Shoppers</h2>
          </ScrollReveal>

          <div className="row g-4 text-start">
            <div className="col-12 col-md-4">
              <ScrollReveal animation="pop-up" delay={100}>
                <SpotlightCard className="p-4 h-100">
                  <div className="fs-1 text-success fw-bold mb-2">01</div>
                  <h5 className="fw-bold mb-2">Browse & Pre-Order</h5>
                  <p className="small text-muted mb-0">
                    Select fresh heirloom produce, berries, artisanal loaves, or raw honey against verified farmer stock.
                  </p>
                </SpotlightCard>
              </ScrollReveal>
            </div>

            <div className="col-12 col-md-4">
              <ScrollReveal animation="pop-up" delay={200}>
                <SpotlightCard className="p-4 h-100">
                  <div className="fs-1 text-success fw-bold mb-2">02</div>
                  <h5 className="fw-bold mb-2">Choose Pickup Slot</h5>
                  <p className="small text-muted mb-0">
                    Pick your preferred weekend morning time slot at the designated market stall. Your crate is packed fresh.
                  </p>
                </SpotlightCard>
              </ScrollReveal>
            </div>

            <div className="col-12 col-md-4">
              <ScrollReveal animation="pop-up" delay={300}>
                <SpotlightCard className="p-4 h-100">
                  <div className="fs-1 text-success fw-bold mb-2">03</div>
                  <h5 className="fw-bold mb-2">Pick Up & Settle</h5>
                  <p className="small text-muted mb-0">
                    Meet your local grower, inspect your harvest, and settle payment in person via cash, card, or phone.
                  </p>
                </SpotlightCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Modal if active */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
