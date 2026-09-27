import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import FuseButton from '../components/reactbits/FuseButton';

export default function CustomerDashboardPage() {
  const { user, toggleFavorite } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [favoriteFarmersList, setFavoriteFarmersList] = useState([]);
  const [favoriteProductsList, setFavoriteProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modify Order Modal state
  const [modifyingOrder, setModifyingOrder] = useState(null);
  const [newSlot, setNewSlot] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Rating Modal state
  const [ratingOrder, setRatingOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCustomerData();
  }, [user]);

  async function loadCustomerData() {
    setLoading(true);
    try {
      const myOrders = await api.getMyOrders();
      setOrders(myOrders || []);

      if (user.favoriteFarmers && user.favoriteFarmers.length > 0) {
        const farmers = await api.getFarmers();
        setFavoriteFarmersList(farmers.filter(f => user.favoriteFarmers.includes(f._id)));
      }

      if (user.favoriteProducts && user.favoriteProducts.length > 0) {
        const prods = await api.getProducts();
        setFavoriteProductsList(prods.filter(p => user.favoriteProducts.includes(p._id)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelOrder = async (orderId) => {
    const reason = prompt('Please specify a reason for cancellation:');
    if (!reason) return;

    try {
      await api.cancelOrder(orderId, reason);
      alert('Pre-order cancelled successfully.');
      loadCustomerData();
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    if (!modifyingOrder) return;

    try {
      await api.modifyOrder(modifyingOrder._id, {
        pickupTimeSlot: newSlot || modifyingOrder.pickupTimeSlot,
        specialInstructions: newNotes
      });
      alert('Pickup details updated successfully.');
      setModifyingOrder(null);
      loadCustomerData();
    } catch (err) {
      alert(err.message || 'Failed to update order.');
    }
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach(item => {
      addToCart({
        _id: item.productId,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        farmerId: order.farmerId,
        farmerName: order.farmerName,
        stallName: order.stallName
      }, item.quantity);
    });
    alert('Items added to your basket! Opening checkout drawer.');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ratingOrder) return;

    setSubmittingReview(true);
    try {
      await api.submitReview({
        productId: ratingOrder.items[0]?.productId || '',
        farmerId: ratingOrder.farmerId,
        rating: reviewRating,
        comment: reviewComment
      });
      alert('Review submitted! Thank you for supporting local growers.');
      setRatingOrder(null);
      setReviewComment('');
    } catch (err) {
      alert(err.message || 'Failed to post review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="glass-panel p-4 p-lg-5 mb-5 border">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-semibold mb-2">
              CUSTOMER DASHBOARD
            </span>
            <h2 className="fw-bold mb-1" style={{ color: '#0f2e1a' }}>Welcome back, {user.name}!</h2>
            <div className="text-muted small">
              Manage your harvest pre-orders, view status updates, and explore your favorite growers.
            </div>
          </div>
          <Link to="/products" className="btn btn-egreen rounded-pill">
            <i className="bi bi-cart-plus me-1"></i> Order More Fresh Produce
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Orders Column */}
        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="fw-bold mb-0">My Pre-Orders ({orders.length})</h4>
            <span className="small text-muted">Settlement is made at pickup</span>
          </div>

          {loading ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border">
              <div className="fs-1 mb-2">🧺</div>
              <h5 className="fw-bold text-dark">No Pre-Orders Yet</h5>
              <p className="small text-muted mb-4">
                Explore nearby farmers markets and pre-order your fresh fruits, veggies, and bread for weekend pickup.
              </p>
              <Link to="/products" className="btn btn-egreen">Browse Fresh Catalog</Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map(order => {
                const isCompleted = order.order_status === 'completed';
                const isCancelled = order.order_status === 'cancelled';
                const canModifyOrCancel = !isCompleted && !isCancelled && order.order_status !== 'ready_for_pickup';

                return (
                  <div key={order._id} className="p-4 bg-white rounded-4 border shadow-xs">
                    {/* Top Row */}
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold mb-0">Order #{order.orderNumber}</h6>
                          <span className={`badge badge-status-${order.order_status || 'placed'}`}>
                            {(order.order_status || 'placed').replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="small text-muted mt-1">
                          🧑‍🌾 Farmer Stall: <strong>{order.stallName || order.farmerName}</strong>
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="fs-5 fw-bold text-success">${Number(order.total_amount).toFixed(2)}</div>
                        <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                          Pay In-Person at Stall
                        </div>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    {!isCancelled && (
                      <div className="p-3 bg-light rounded-3 mb-3">
                        <div className="small text-muted mb-2 fw-semibold">Pickup Status Progress:</div>
                        <div className="d-flex align-items-center justify-content-between small position-relative">
                          <div className={`text-center ${order.order_status ? 'text-success fw-bold' : 'text-muted'}`}>
                            <div>● Placed</div>
                          </div>
                          <div className="flex-grow-1 border-top mx-2"></div>
                          <div className={`text-center ${['accepted', 'ready_for_pickup', 'completed'].includes(order.order_status) ? 'text-success fw-bold' : 'text-muted'}`}>
                            <div>● Accepted</div>
                          </div>
                          <div className="flex-grow-1 border-top mx-2"></div>
                          <div className={`text-center ${['ready_for_pickup', 'completed'].includes(order.order_status) ? 'text-success fw-bold' : 'text-muted'}`}>
                            <div>● Ready for Pickup</div>
                          </div>
                          <div className="flex-grow-1 border-top mx-2"></div>
                          <div className={`text-center ${order.order_status === 'completed' ? 'text-success fw-bold' : 'text-muted'}`}>
                            <div>● Completed</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="border-top pt-2 mb-3">
                      <div className="small fw-semibold text-muted mb-2">Reserved Items:</div>
                      <div className="d-flex flex-wrap gap-2">
                        {order.items?.map((it, idx) => (
                          <span key={idx} className="badge bg-light text-dark border p-2">
                            {it.name} × {it.quantity} {it.unit} (${Number(it.price * it.quantity).toFixed(2)})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pickup Details */}
                    <div className="row g-2 small text-secondary bg-light p-2 rounded-3 mb-3">
                      <div className="col-12 col-md-6">
                        <strong>📅 Pickup Date:</strong> {order.pickupDate}
                      </div>
                      <div className="col-12 col-md-6">
                        <strong>⏰ Window:</strong> {order.pickupTimeSlot}
                      </div>
                      {order.specialInstructions && (
                        <div className="col-12">
                          <strong>Note:</strong> "{order.specialInstructions}"
                        </div>
                      )}
                      {order.cancellationReason && (
                        <div className="col-12 text-danger">
                          <strong>Cancellation Note:</strong> {order.cancellationReason}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="d-flex flex-wrap gap-2 justify-content-end">
                      {canModifyOrCancel && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setModifyingOrder(order);
                              setNewSlot(order.pickupTimeSlot);
                              setNewNotes(order.specialInstructions || '');
                            }}
                            className="btn btn-sm btn-outline-secondary rounded-pill"
                          >
                            <i className="bi bi-pencil"></i> Modify Slot
                          </button>
                          <FuseButton
                            onConfirm={() => handleCancelOrder(order._id)}
                            label="Cancel Order"
                            confirmingLabel="Hold Fuse to Cancel..."
                          />
                        </>
                      )}

                      {/* 1-Click Re-Order */}
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="btn btn-sm btn-outline-success rounded-pill"
                      >
                        <i className="bi bi-arrow-repeat"></i> Re-Order Items
                      </button>

                      {/* Rate & Review Farmer/Product if completed */}
                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => setRatingOrder(order)}
                          className="btn btn-sm btn-success rounded-pill text-white"
                        >
                          ★ Rate & Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Favorites & Restock Alerts */}
        <div className="col-12 col-lg-4">
          {/* Favorite Farmers */}
          <div className="p-4 bg-white rounded-4 border mb-4 shadow-xs">
            <h5 className="fw-bold mb-3">🧑‍🌾 Favorite Farmers</h5>
            {favoriteFarmersList.length === 0 ? (
              <p className="small text-muted mb-0">
                You haven't favorited any farmers yet. Click the heart icon on any farmer stall to get restock alerts!
              </p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {favoriteFarmersList.map(f => (
                  <div key={f._id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3">
                    <div>
                      <div className="fw-bold small">{f.stallName || f.name}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        {(f.operatingDays || []).join(', ')}
                      </div>
                    </div>
                    <Link to={`/farmers/${f._id}`} className="btn btn-sm btn-outline-success rounded-pill">
                      Visit Stall
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Products */}
          <div className="p-4 bg-white rounded-4 border shadow-xs">
            <h5 className="fw-bold mb-3">❤️ Saved Fresh Produce</h5>
            {favoriteProductsList.length === 0 ? (
              <p className="small text-muted mb-0">
                Save your staple veggies, berries, and sourdough to re-order in 1-click every week!
              </p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {favoriteProductsList.map(p => (
                  <div key={p._id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3">
                    <div>
                      <div className="fw-bold small text-truncate" style={{ maxWidth: '140px' }}>{p.name}</div>
                      <div className="text-success small fw-semibold">${Number(p.price).toFixed(2)} / {p.unit}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(p, 1)}
                      className="btn btn-sm btn-success rounded-pill"
                    >
                      + Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modify Order Modal */}
      {modifyingOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4">
              <div className="modal-header border-0 p-0 mb-3">
                <h5 className="fw-bold mb-0">Modify Pickup Slot</h5>
                <button type="button" className="btn-close" onClick={() => setModifyingOrder(null)}></button>
              </div>
              <form onSubmit={handleModifySubmit}>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Select Pickup Time Window</label>
                  <select
                    className="form-select"
                    value={newSlot}
                    onChange={e => setNewSlot(e.target.value)}
                  >
                    <option value="08:00 AM – 09:00 AM">08:00 AM – 09:00 AM</option>
                    <option value="09:00 AM – 10:00 AM">09:00 AM – 10:00 AM</option>
                    <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
                    <option value="11:00 AM – 12:00 PM">11:00 AM – 12:00 PM</option>
                    <option value="12:00 PM – 01:00 PM">12:00 PM – 01:00 PM</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Special Packaging Instructions</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setModifyingOrder(null)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {ratingOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4">
              <div className="modal-header border-0 p-0 mb-3">
                <h5 className="fw-bold mb-0">Rate & Review Farmer Harvest</h5>
                <button type="button" className="btn-close" onClick={() => setRatingOrder(null)}></button>
              </div>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Rating</label>
                  <select
                    className="form-select"
                    value={reviewRating}
                    onChange={e => setReviewRating(Number(e.target.value))}
                  >
                    <option value="5">★★★★★ (5 Stars - Exceptional Freshness)</option>
                    <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                    <option value="3">★★★☆☆ (3 Stars - Average)</option>
                    <option value="2">★★☆☆☆ (2 Stars - Below Expectation)</option>
                    <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Your Review Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Tell the community how fresh the produce was and how pickup went..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={() => setRatingOrder(null)}>Close</button>
                  <button type="submit" className="btn btn-success" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
