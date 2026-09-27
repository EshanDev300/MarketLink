import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import { useAuth } from '../context/AuthContext';

export default function FarmerProfilePage() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const f = await api.getFarmerById(id);
        setFarmer(f);

        const prods = await api.getProducts({ farmer: id });
        setProducts(prods || []);

        const revs = await api.getFarmerReviews(id);
        setReviews(revs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="container py-5 text-center">
        <h4>Farmer Profile Not Found</h4>
        <Link to="/products" className="btn btn-egreen mt-3">Browse Produce</Link>
      </div>
    );
  }

  const isFavorite = user?.favoriteFarmers?.includes(farmer._id);

  return (
    <div className="container py-5">
      {/* Farmer Profile Header */}
      <div className="glass-panel p-4 p-lg-5 mb-5 border">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-3 text-center">
            <img
              src={farmer.avatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80'}
              alt={farmer.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=80';
              }}
              className="rounded-circle shadow-md object-fit-cover border border-3 border-success"
              style={{ width: '160px', height: '160px' }}
            />
          </div>

          <div className="col-12 col-md-9">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div>
                <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 mb-1">
                  Certified Local Grower
                </span>
                <h2 className="fw-bold mb-0 text-dark">{farmer.stallName || farmer.name}</h2>
                <div className="text-muted small">🧑‍🌾 Contact Person: {farmer.contactPerson || farmer.name}</div>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite('farmer', farmer._id)}
                className={`btn btn-sm rounded-pill px-3 py-2 ${
                  isFavorite ? 'btn-danger text-white' : 'btn-outline-danger'
                }`}
              >
                <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                {isFavorite ? 'Favorited Grower' : 'Add to Favorites'}
              </button>
            </div>

            <p className="text-secondary small mb-3" style={{ lineHeight: '1.6' }}>
              {farmer.bio || 'Dedicated to organic, environmentally conscious, and regenerative agricultural practices. Providing community markets with highest-quality fresh seasonal food.'}
            </p>

            <div className="row g-2 p-3 bg-light rounded-4 small">
              <div className="col-12 col-md-4">
                <strong>📍 Market Stall Location:</strong>
                <div>{farmer.stallLocation?.address || farmer.address || 'Central Market Plaza'}</div>
              </div>
              <div className="col-6 col-md-4">
                <strong>📅 Operating Days:</strong>
                <div>{(farmer.operatingDays || []).join(', ') || 'Saturday & Sunday'}</div>
              </div>
              <div className="col-6 col-md-4">
                <strong>⏰ Pickup Time Window:</strong>
                <div>{farmer.pickupTimeWindows || '08:00 AM - 01:00 PM'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listed Products */}
      <div className="mb-5">
        <h4 className="fw-bold mb-3">Available Harvest Stock ({products.length})</h4>
        {products.length === 0 ? (
          <div className="p-4 bg-white rounded-4 border text-center text-muted">
            This farmer has not listed inventory for this cycle yet.
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

      {/* Customer Reviews for this Farmer */}
      <div className="p-4 bg-white rounded-4 border">
        <h4 className="fw-bold mb-3">Customer Reviews for {farmer.name} ({reviews.length})</h4>
        {reviews.length === 0 ? (
          <p className="text-muted small mb-0">No reviews recorded yet for this grower stall.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map(r => (
              <div key={r._id} className="p-3 bg-light rounded-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fw-bold small">{r.customerName || 'Customer'}</span>
                  <span className="text-warning small">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="small text-secondary mb-2">{r.comment}</p>
                {r.farmerReply && (
                  <div className="p-2 bg-success-subtle rounded small border-start border-success border-3">
                    <strong>🧑‍🌾 Farmer Response:</strong> {r.farmerReply}
                  </div>
                )}
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
