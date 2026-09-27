import React, { useState, useEffect } from 'react';
import ProductFilter from '../components/products/ProductFilter';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import DepthCard from '../components/reactbits/DepthCard';
import ScrollReveal from '../components/reactbits/ScrollReveal';
import TextMorph from '../components/reactbits/TextMorph';
import ParticleText from '../components/reactbits/ParticleText';
import ShaderCard from '../components/reactbits/ShaderCard';
import { generateVegetablePdf } from '../utils/vegetablePdfGenerator';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [filters, setFilters] = useState({
    category: 'All',
    search: '',
    market: 'All',
    day: 'All',
    sort: 'newest',
    inStockOnly: false
  });

  useEffect(() => {
    async function loadData() {
      try {
        const m = await api.getMarkets();
        setMarkets(m || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = {};
        if (filters.category && filters.category !== 'All') queryParams.category = filters.category;
        if (filters.market && filters.market !== 'All') queryParams.market = filters.market;
        if (filters.search && filters.search.trim()) queryParams.search = filters.search.trim();
        if (filters.day && filters.day !== 'All') queryParams.day = filters.day;
        if (filters.sort) queryParams.sort = filters.sort;
        if (filters.inStockOnly) queryParams.inStockOnly = 'true';

        const data = await api.getProducts(queryParams);
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filters]);

  // Featured seasonal spotlight items
  const spotlightItems = products.slice(0, 3);

  return (
    <div className="container py-5">
      {/* ReactBits Interactive Particle Text Header */}
      <div className="text-center mb-2">
        <ParticleText text="FRESH HARVEST" color="#10b981" fontSize={42} height={70} />
      </div>

      {/* Title Header with TextMorph */}
      <ScrollReveal animation="pop-up">
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2 shadow-xs">
            WEEKLY HARVEST CATALOG • 30+ FARM PRODUCE ITEMS
          </span>
          <h1 className="display-5 fw-bold mb-2">
            Organically Grown &{' '}
            <TextMorph
              words={[
                'Orchard Fruits 🍓',
                'Heirloom Greens 🥬',
                'Wild Mushrooms 🍄',
                'Artisan Loaves 🥖',
                'Pasture Eggs 🥚',
                'Pure Honey 🍯'
              ]}
              className="text-success font-heading"
            />
          </h1>
          <p className="text-muted mb-3">
            Browse real-time stock directly from certified local growers. Pre-order online to reserve your crate with $0 payment fee, and settle in-person at your weekend market stall.
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => generateVegetablePdf()}
              className="btn btn-sm btn-egreen rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2"
            >
              <i className="bi bi-file-earmark-pdf-fill text-warning fs-6"></i> 
              <span>Download Vegetable Definition Guide (PDF)</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Featured Shader Card & 3D Interactive Spotlight Section */}
      <div className="row g-4 mb-5 align-items-stretch">
        <div className="col-12 col-lg-4">
          <ShaderCard
            title="Sunrise Reserve Box"
            subtitle="Curated by Master Agronomists"
            badge="⚡ Limited Weekly Allotment"
            glowColor="#10b981"
            className="h-100"
          >
            <p className="small text-secondary mb-3">
              Each weekend, our certified partner farms reserve 50 premium wooden crates packed with peak-sweetness heirloom crops picked within 6 hours of pickup.
            </p>
            <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-body-tertiary border mb-3">
              <span className="small fw-semibold text-muted">Weekly Crate Price:</span>
              <span className="fw-bold text-success fs-5">$28.50</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-egreen w-100 rounded-pill py-2"
              onClick={() => {
                if (products.length > 0) addToCart(products[0], 1);
              }}
            >
              <i className="bi bi-basket me-1"></i> Quick Reserve Crate
            </button>
          </ShaderCard>
        </div>

        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0 font-heading">
              <span className="text-success me-2">🌱</span> Seasonal Sunrise Harvest Highlights
            </h5>
            <span className="badge rounded-pill bg-success-subtle text-success px-2.5 py-1">
              3D Interactive View
            </span>
          </div>
          <div className="row g-3">
            {spotlightItems.map((item, idx) => (
              <div key={item._id} className="col-12 col-sm-4">
                <ScrollReveal animation="pop-up" delay={idx * 100}>
                  <DepthCard
                    image={item.image}
                    title={item.name}
                    subtitle={`🧑‍🌾 ${item.farmerName}`}
                    badge={item.harvestDay || 'Fresh Picked'}
                    price={`$${item.price.toFixed(2)} / ${item.unit}`}
                    rating={`★ ${item.ratingAverage || 5.0}`}
                    tags={[item.category]}
                    onClick={() => setSelectedProduct(item)}
                  >
                    <div className="mt-2.5">
                      <button
                        type="button"
                        className="btn btn-sm btn-egreen w-100 rounded-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                        }}
                      >
                        <i className="bi bi-basket me-1"></i> Add to Cart
                      </button>
                    </div>
                  </DepthCard>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured 3D Depth Card Spotlight for Seasonal Produce */}
      {spotlightItems.length >= 3 && filters.category === 'All' && !filters.search && (
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0 font-heading">
              <span className="text-success me-2">⚡</span> Featured Sunrise Harvest
            </h5>
            <span className="badge rounded-pill bg-success-subtle text-success px-2.5 py-1">
              3D Interactive View
            </span>
          </div>
          <div className="row g-4">
            {spotlightItems.map((item, idx) => (
              <div key={item._id} className="col-12 col-md-4">
                <ScrollReveal animation="pop-up" delay={idx * 100}>
                  <DepthCard
                    image={item.image}
                    title={item.name}
                    subtitle={`🧑‍🌾 ${item.farmerName}`}
                    badge={item.harvestDay || 'Fresh Picked'}
                    price={`$${item.price.toFixed(2)} / ${item.unit}`}
                    rating={`★ ${item.ratingAverage || 5.0}`}
                    tags={[item.category, `${item.stock_quantity} in stock`]}
                    onClick={() => setSelectedProduct(item)}
                  >
                    <div className="mt-3 d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-egreen flex-grow-1 rounded-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1);
                        }}
                      >
                        <i className="bi bi-basket me-1"></i> Add to Cart
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '34px', height: '34px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(item);
                        }}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </div>
                  </DepthCard>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Component */}
      <ProductFilter
        filters={filters}
        onChange={setFilters}
        markets={markets}
      />

      {/* Products Counter & Quick Info */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div className="small text-muted fw-semibold">
          Showing <strong>{products.length}</strong> farm-fresh harvest items
          {filters.category !== 'All' && <span> in <strong className="text-success">{filters.category}</strong></span>}
        </div>
        {(filters.category !== 'All' || filters.search || filters.market !== 'All' || filters.day !== 'All') && (
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none text-danger p-0"
            onClick={() => setFilters({ category: 'All', search: '', market: 'All', day: 'All', sort: 'newest', inStockOnly: false })}
          >
            <i className="bi bi-x-circle me-1"></i> Reset All Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="small text-muted mt-2">Loading fresh produce inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 card rounded-4 border p-4" style={{ background: 'var(--card-bg)' }}>
          <div className="fs-1 mb-2">🥬</div>
          <h5 className="fw-bold">No produce found matching your criteria</h5>
          <p className="text-muted small mb-3">Try adjusting your filters, category, or search keywords.</p>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-egreen rounded-pill px-4"
              onClick={() => setFilters({ category: 'All', search: '', market: 'All', day: 'All', sort: 'newest', inStockOnly: false })}
            >
              Show All Produce
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((prod, idx) => (
            <div key={prod._id} className="col-12 col-sm-6 col-lg-3">
              <ScrollReveal animation="pop-up" delay={(idx % 4) * 60}>
                <ProductCard
                  product={prod}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}

      {/* Extended Seasonal Crop Harvest Calendar */}
      <div className="mt-5 pt-4 border-top">
        <div className="text-center mb-4">
          <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
            REGIONAL AGRONOMY CALENDAR
          </span>
          <h3 className="fw-bold font-heading">Seasonal Harvest & Crop Availability</h3>
          <p className="text-muted small max-w-lg mx-auto">
            Our certified growers align their planting cycles with natural rainfall and micro-climates. Here is what is peaking right now across our regional farmer network:
          </p>
        </div>

        <div className="row g-3 mb-5">
          <div className="col-12 col-md-3">
            <div className="card p-3 h-100 rounded-4 border" style={{ background: 'var(--card-bg)' }}>
              <div className="fs-3 mb-2">🥬</div>
              <h6 className="fw-bold mb-1">Spring & Early Summer</h6>
              <div className="small text-success fw-semibold mb-2">Crisp Greens & Shoots</div>
              <p className="small text-secondary mb-0">
                Baby Butterhead Lettuce, French Radishes, Asparagus, Spring Garlic, Rainbow Chard, and Wild Garlic scapes.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card p-3 h-100 rounded-4 border border-success" style={{ background: 'var(--card-bg)' }}>
              <div className="fs-3 mb-2">☀️</div>
              <h6 className="fw-bold mb-1">Peak Mid-Summer</h6>
              <div className="small text-success fw-semibold mb-2">Sun-Ripened Solanaceae</div>
              <p className="small text-secondary mb-0">
                Heirloom Brandywine Tomatoes, Sweet Albion Strawberries, Sweet Corn, Purple Bell Peppers, and Japanese Cucumbers.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card p-3 h-100 rounded-4 border" style={{ background: 'var(--card-bg)' }}>
              <div className="fs-3 mb-2">🍁</div>
              <h6 className="fw-bold mb-1">Autumn Harvest</h6>
              <div className="small text-success fw-semibold mb-2">Roots & Gourds</div>
              <p className="small text-secondary mb-0">
                Kabocha Squash, Honeycrisp Apples, Rainbow Carrots, Wild Chanterelles, and Romanesco Cauliflower.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="card p-3 h-100 rounded-4 border" style={{ background: 'var(--card-bg)' }}>
              <div className="fs-3 mb-2">❄️</div>
              <h6 className="fw-bold mb-1">Winter Cellar Storage</h6>
              <div className="small text-success fw-semibold mb-2">Brassicas & Tubers</div>
              <p className="small text-secondary mb-0">
                Lacinato Tuscan Kale, Purple Sweet Potatoes, Meyer Lemons, Winter Leeks, and Raw Hillside Wildflower Honey.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Pillar Organic Guarantee Banner */}
        <div className="card p-4 rounded-4 border shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.03))' }}>
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-3 text-center text-md-start">
              <span className="fs-1 text-success">🌿</span>
              <h5 className="fw-bold mt-2 mb-1 font-heading">Our Sourcing Promise</h5>
              <p className="small text-muted mb-0">100% verified regional growers</p>
            </div>
            <div className="col-12 col-md-3">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-patch-check-fill text-success fs-5"></i>
                <div>
                  <strong className="d-block small">Zero Synthetic Pesticides</strong>
                  <span className="text-secondary small">Cultivated using organic compost, beneficial insects, and companion planting.</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-clock-history text-success fs-5"></i>
                <div>
                  <strong className="d-block small">Picked Within 24 Hours</strong>
                  <span className="text-secondary small">Crops are harvested fresh for your chosen weekend pickup window.</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-wallet2 text-success fs-5"></i>
                <div>
                  <strong className="d-block small">100% to Growers</strong>
                  <span className="text-secondary small">Zero transaction cut deducted from farmers. Full proceeds support family farms.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
