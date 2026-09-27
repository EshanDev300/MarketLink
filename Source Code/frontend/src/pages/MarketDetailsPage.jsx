import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';

export default function MarketDetailsPage() {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMarket() {
      setLoading(true);
      try {
        const data = await api.getMarketById(id);
        setMarket(data.market);
        setFarmers(data.farmers || []);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMarket();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="container py-5 text-center">
        <h4>Market not found</h4>
        <Link to="/markets" className="btn btn-egreen mt-3">Back to Markets</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/markets" className="text-success text-decoration-none">Markets</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{market.name}</li>
        </ol>
      </nav>

      {/* Hero Banner */}
      <div className="glass-panel overflow-hidden mb-5 border p-0">
        <div className="row g-0">
          <div className="col-12 col-md-5">
            <img
              src={market.image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'}
              alt={market.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-100 h-100 object-fit-cover"
              style={{ minHeight: '260px' }}
            />
          </div>
          <div className="col-12 col-md-7 p-4 p-lg-5 d-flex flex-column justify-content-center">
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 mb-2 w-fit">
              {market.city || 'Farmers Market Hub'}
            </span>
            <h2 className="display-6 fw-bold mb-2 text-dark-emphasis">{market.name}</h2>
            <p className="text-muted mb-3">{market.description || market.address}</p>

            <div className="row g-2 mb-4 small p-3 rounded-4 border" style={{ background: 'var(--card-bg)' }}>
              <div className="col-6">
                <strong>📍 Address:</strong>
                <div className="text-secondary">{market.address}</div>
              </div>
              <div className="col-6">
                <strong>⏰ Hours:</strong>
                <div className="text-secondary">{market.timings || '08:00 AM - 01:30 PM'}</div>
              </div>
              <div className="col-12 pt-2 border-top">
                <strong>📅 Market Days:</strong> <span className="text-success fw-semibold">{Array.isArray(market.operatingDays) ? market.operatingDays.map(d => typeof d === 'object' ? d.day : d).join(', ') : 'Weekends'}</span>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-egreen rounded-pill px-4 shadow-sm"
              >
                <i className="bi bi-map me-1"></i> Open in Maps Directions
              </a>
              <Link to="/contact" className="btn btn-outline-secondary rounded-pill px-4">
                <i className="bi bi-shop me-1"></i> Apply for Stall Space
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Market Pavilion Amenities */}
      <div className="card p-4 rounded-4 border mb-5 shadow-xs" style={{ background: 'var(--card-bg)' }}>
        <h5 className="fw-bold mb-3 font-heading">
          <span className="text-success me-2">🎪</span> Pavilion Facilities & Shopper Amenities
        </h5>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">♿</span>
              <div className="small">
                <strong>ADA Accessible</strong>
                <div className="text-muted">Wide paved walkways</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">🅿️</span>
              <div className="small">
                <strong>Validated Parking</strong>
                <div className="text-muted">2 Hours free with receipt</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">🐕</span>
              <div className="small">
                <strong>Dog Friendly</strong>
                <div className="text-muted">Leashed pets welcome</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-4">💳</span>
              <div className="small">
                <strong>Zero Fee Pre-Orders</strong>
                <div className="text-muted">Pick up at stall without delay</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farmers Selling at this Market */}
      <div className="mb-5">
        <h4 className="fw-bold mb-3 font-heading">Farmers & Vendors Present at this Market ({farmers.length})</h4>
        {farmers.length === 0 ? (
          <p className="text-muted small">No vendor stalls listed yet for this market.</p>
        ) : (
          <div className="row g-3">
            {farmers.map(f => (
              <div key={f._id} className="col-12 col-sm-6 col-md-4">
                <div className="p-3 rounded-4 border shadow-xs d-flex align-items-center gap-3" style={{ background: 'var(--card-bg)' }}>
                  <img
                    src={f.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=120&q=80'}
                    alt={f.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=120&q=80';
                    }}
                    className="rounded-circle object-fit-cover border"
                    style={{ width: '56px', height: '56px' }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="fw-bold mb-0 text-truncate text-dark-emphasis">{f.stallName || f.name}</h6>
                    <div className="small text-muted text-truncate">🧑‍🌾 {f.contactPerson || f.name}</div>
                    <div className="small text-success fw-semibold mt-1">
                      🕒 {f.pickupTimeWindows || '08:00 AM - 01:00 PM'}
                    </div>
                  </div>
                  <Link to={`/farmers/${f._id}`} className="btn btn-sm btn-outline-success rounded-circle p-2" title="View Stall">
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Products at this Market */}
      <div>
        <h4 className="fw-bold mb-3 font-heading">Fresh Stock Available for Pickup ({products.length})</h4>
        {products.length === 0 ? (
          <div className="p-4 rounded-4 border text-center text-muted" style={{ background: 'var(--card-bg)' }}>
            No products currently in stock for this market. Check back before market day!
          </div>
        ) : (
          <div className="row g-4">
            {products.map(prod => (
              <div key={prod._id} className="col-12 col-sm-6 col-lg-3">
                <ProductCard
                  product={prod}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
