import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PeekRating from '../reactbits/PeekRating';
import { api } from '../../services/api';

export default function ProductDetailsModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product) return;
    async function loadReviews() {
      setLoadingReviews(true);
      try {
        const list = await api.getProductReviews(product._id);
        setReviews(list || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, [product]);

  if (!product) return null;

  const stockRemaining = product.stock_quantity ?? product.stockQuantity ?? 0;
  const isOutOfStock = product.isSoldOut || stockRemaining <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to leave a review.');
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const newRev = await api.submitReview({
        productId: product._id,
        farmerId: product.farmerId || product.farmer,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews(prev => [newRev, ...prev]);
      setReviewComment('');
      alert('Thank you for rating this product!');
    } catch (err) {
      alert('Failed to post review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div 
      className="modal show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)', zIndex: 1080 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="modal-header border-0 bg-light px-4 py-3">
            <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold">
              {product.category?.name || product.category || 'Farm Fresh'}
            </span>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Product Image */}
              <div className="col-12 col-md-5">
                <div className="rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '340px' }}>
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="col-12 col-md-7 d-flex flex-column">
                <h4 className="fw-bold mb-1 text-dark-emphasis font-heading">{product.name}</h4>
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
                  <div className="text-muted small">
                    🧑‍🌾 Farm: <strong>{product.stallName || product.farmerName || 'Local Organic Grower'}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-1.5">
                    <span className="small text-warning fw-bold d-flex align-items-center gap-1">
                      <i className="bi bi-star-fill"></i>
                      <span>{product.ratingAverage || '5.0'}</span>
                    </span>
                    <PeekRating rating={product.ratingAverage || 5.0} count={product.reviewsCount || 42} />
                  </div>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-3">
                  <span className="fs-3 fw-bold text-success">${Number(product.price).toFixed(2)}</span>
                  <span className="text-muted">/ {product.unit}</span>
                  <span className={`badge ${isOutOfStock ? 'bg-danger' : 'bg-success'} ms-auto`}>
                    {isOutOfStock ? 'Sold Out' : `${stockRemaining} ${product.unit} Available`}
                  </span>
                </div>

                <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>
                  {product.description || 'Grown locally using sustainable agriculture practices. Harvested at the peak of ripeness to ensure nutrition, crunch, and exceptional flavor.'}
                </p>

                {/* Pre-order Actions */}
                <div className="mt-auto p-3 bg-light rounded-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="input-group" style={{ width: '130px' }}>
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={isOutOfStock}
                      >-</button>
                      <input 
                        type="text" 
                        className="form-control text-center bg-white" 
                        value={quantity} 
                        readOnly 
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setQuantity(q => Math.min(stockRemaining, q + 1))}
                        disabled={isOutOfStock || quantity >= stockRemaining}
                      >+</button>
                    </div>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={handleAddToCart}
                      className="btn btn-egreen flex-grow-1"
                    >
                      <i className="bi bi-cart-plus me-1"></i> Add to Pre-Order
                    </button>
                  </div>
                  <div className="small text-muted mt-2 text-center" style={{ fontSize: '0.78rem' }}>
                    💡 Pre-orders are reserved for market-day stall pickup. Payment is made at the stall.
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-5 pt-4 border-top">
              <h5 className="fw-bold mb-3">Customer Reviews & Ratings</h5>

              {/* Review Input */}
              {user && user.role === 'customer' && (
                <form onSubmit={handleReviewSubmit} className="mb-4 p-3 bg-light rounded-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="small fw-semibold">Your Rating:</span>
                    <select 
                      className="form-select form-select-sm w-auto"
                      value={reviewRating}
                      onChange={e => setReviewRating(Number(e.target.value))}
                    >
                      <option value="5">★★★★★ (5 Stars)</option>
                      <option value="4">★★★★☆ (4 Stars)</option>
                      <option value="3">★★★☆☆ (3 Stars)</option>
                      <option value="2">★★☆☆☆ (2 Stars)</option>
                      <option value="1">★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Share your experience with this harvest item..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      required
                    />
                    <button 
                      type="submit" 
                      className="btn btn-success" 
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Posting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {loadingReviews ? (
                <div className="text-center py-3 text-muted">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-3 text-muted small">
                  No customer reviews yet. Be the first to try this farm fresh harvest!
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-3 border rounded-3 bg-white shadow-xs">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold small">{rev.customerName || 'Customer'}</span>
                        <span className="text-warning small">
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p className="small text-secondary mb-1">{rev.comment}</p>

                      {rev.farmerReply && (
                        <div className="p-2 mt-2 bg-success-subtle rounded small border-start border-success border-3">
                          <strong>🧑‍🌾 Farmer Response:</strong> {rev.farmerReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
