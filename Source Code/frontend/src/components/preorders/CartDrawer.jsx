import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const TIME_SLOTS = [
  '08:00 AM – 09:00 AM',
  '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 01:00 PM'
];

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    totalAmount,
    farmerId,
    farmerName
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pickupDate, setPickupDate] = useState('Saturday, Oct 3, 2026');
  const [pickupTimeSlot, setPickupTimeSlot] = useState(TIME_SLOTS[1]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Account required! You must register or log in before you can pre-order or purchase farm produce.');
      setIsCartOpen(false);
      navigate('/register');
      return;
    }

    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      const res = await api.placeOrder({
        farmerId: farmerId || cartItems[0].farmerId,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity
        })),
        pickupDate,
        pickupTimeSlot,
        specialInstructions
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setOrderSuccess(res.order);
      clearCart();
    } catch (err) {
      alert(err.message || 'Error placing pre-order. Please check stock availability.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => {
          setIsCartOpen(false);
          setOrderSuccess(null);
        }} 
      />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''} p-4`}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4">🧺</span>
            <h5 className="fw-bold mb-0 text-dark-emphasis">Your Harvest Basket</h5>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => {
              setIsCartOpen(false);
              setOrderSuccess(null);
            }}
          ></button>
        </div>

        {/* Order Success View */}
        {orderSuccess ? (
          <div className="text-center my-auto py-4">
            <div className="fs-1 mb-2">🎉</div>
            <h4 className="fw-bold text-success mb-2">Pre-Order Confirmed!</h4>
            <p className="text-muted small mb-3">
              Order <strong>#{orderSuccess.orderNumber}</strong> has been received by{' '}
              <strong>{orderSuccess.farmerName || 'the farmer'}</strong>.
            </p>

            <div className="p-3 bg-light rounded-4 text-start small mb-4">
              <div className="mb-2"><strong>📅 Pickup Date:</strong> {orderSuccess.pickupDate}</div>
              <div className="mb-2"><strong>⏰ Pickup Window:</strong> {orderSuccess.pickupTimeSlot}</div>
              <div className="mb-2"><strong>📍 Location:</strong> {orderSuccess.stallName || 'Farmers Market Stall'}</div>
              <div className="mb-2"><strong>💵 Total Due at Stall:</strong> ${orderSuccess.total_amount?.toFixed(2)}</div>
              <div className="text-success fw-bold">✓ Cash, Card or Mobile Pay accepted at pickup.</div>
            </div>

            <div className="d-grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderSuccess(null);
                  navigate('/customer-dashboard');
                }}
                className="btn btn-egreen"
              >
                View in My Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderSuccess(null);
                }}
                className="btn btn-outline-secondary"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center my-auto py-5">
            <div className="fs-1 mb-2">🌱</div>
            <h5 className="fw-bold text-muted">Your Basket is Empty</h5>
            <p className="small text-secondary mb-4">
              Explore our fresh seasonal vegetables, fruits, sourdough, and honey to build your farm pickup order.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/products');
              }}
              className="btn btn-egreen"
            >
              Browse Fresh Catalog
            </button>
          </div>
        ) : (
          /* Active Cart Form */
          <div className="d-flex flex-column h-100 overflow-hidden">
            {/* Farmer Tag */}
            <div className="p-2 mb-3 bg-success-subtle text-success rounded-3 small fw-semibold d-flex align-items-center justify-content-between">
              <span>🧑‍🌾 Vendor: {farmerName || 'MarketLink Farmer'}</span>
              <button 
                type="button" 
                onClick={clearCart} 
                className="btn btn-link btn-sm text-danger text-decoration-none p-0"
              >
                Clear
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow-1 overflow-y-auto pe-1 mb-3">
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => (
                  <div key={item.productId} className="d-flex align-items-center gap-3 p-2 rounded-3 border" style={{ background: 'var(--card-bg)' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80'}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80';
                      }}
                      className="rounded-3 object-fit-cover border"
                      style={{ width: '56px', height: '56px' }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold small text-truncate" style={{ maxWidth: '170px' }}>{item.name}</div>
                      <div className="text-success small fw-semibold">${item.price.toFixed(2)} / {item.unit}</div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="d-flex align-items-center gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-white border px-2 py-0"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >-</button>
                      <span className="small fw-bold px-1">{item.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-white border px-2 py-0"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >+</button>
                      <button
                        type="button"
                        className="btn btn-sm text-danger border-0 p-1 ms-1"
                        onClick={() => removeFromCart(item.productId)}
                        title="Remove"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup Preferences */}
            <div className="p-3 bg-light rounded-4 mb-3 border">
              <h6 className="fw-bold small mb-2 text-dark">Pickup Preferences</h6>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="small text-muted mb-1">Market Day</label>
                  <select 
                    className="form-select form-select-sm"
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                  >
                    <option value="Saturday, Oct 3, 2026">Saturday, Oct 3</option>
                    <option value="Sunday, Oct 4, 2026">Sunday, Oct 4</option>
                    <option value="Wednesday, Oct 7, 2026">Wednesday, Oct 7</option>
                    <option value="Saturday, Oct 10, 2026">Saturday, Oct 10</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="small text-muted mb-1">Time Slot</label>
                  <select 
                    className="form-select form-select-sm"
                    value={pickupTimeSlot}
                    onChange={e => setPickupTimeSlot(e.target.value)}
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Optional notes for farmer (e.g. pack ripe)"
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Summary & Checkout */}
            <div className="pt-2 border-top">
              {!user && (
                <div className="p-3 mb-3 bg-warning-subtle text-dark border border-warning-subtle rounded-3 small">
                  <div className="d-flex align-items-center gap-2 mb-1.5 fw-bold text-dark">
                    <span>🔒 Registration Required</span>
                  </div>
                  <p className="mb-2 text-secondary" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                    You cannot buy or reserve produce without an account. Please register or log in to finalize your pre-order.
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 flex-grow-1"
                      onClick={() => { setIsCartOpen(false); navigate('/login'); }}
                    >
                      Log In
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-egreen rounded-pill px-3 py-1 flex-grow-1"
                      onClick={() => { setIsCartOpen(false); navigate('/register'); }}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Total Pre-Order Amount:</span>
                <span className="fs-4 fw-bold text-success">${totalAmount.toFixed(2)}</span>
              </div>

              {/* Payment Clarification Alert (SRS requirement) */}
              <div className="p-2 mb-3 bg-success-subtle text-dark border border-success-subtle rounded-3 small text-center" style={{ fontSize: '0.78rem' }}>
                💳 <strong>In-Person Settlement:</strong> Payment is collected directly at the farmer stall upon pickup. No online fee!
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={handlePlaceOrder}
                className="btn btn-egreen w-100 py-2.5 fs-6 rounded-pill fw-bold shadow-sm"
              >
                {!user ? 'Register / Log In to Place Order' : submitting ? 'Reserving Harvest...' : `Confirm Pre-Order ($${totalAmount.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
