import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function FarmerDashboardPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'stock', 'insights', 'reviews', 'profile'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Product modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    stock_quantity: '',
    description: '',
    image: '',
    isRecurringTemplate: true,
    harvestDay: 'Friday Morning'
  });

  // Reply Review state
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    stallName: '',
    contactPerson: '',
    contactNumber: '',
    address: '',
    operatingDays: ['Saturday', 'Sunday'],
    pickupTimeWindows: '08:00 AM - 01:00 PM',
    orderCutoffHours: 4,
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'farmer' && user.role !== 'admin') {
      alert('Access restricted to verified farmers.');
      navigate('/');
      return;
    }

    setProfileForm({
      stallName: user.stallName || '',
      contactPerson: user.contactPerson || user.name,
      contactNumber: user.contactNumber || '',
      address: user.address || '',
      operatingDays: user.operatingDays || ['Saturday', 'Sunday'],
      pickupTimeWindows: user.pickupTimeWindows || '08:00 AM - 01:00 PM',
      orderCutoffHours: user.orderCutoffHours || 4,
      bio: user.bio || ''
    });

    loadFarmerData();
  }, [user]);

  async function loadFarmerData() {
    setLoading(true);
    try {
      const incomingOrders = await api.getFarmerOrders();
      setOrders(incomingOrders || []);

      const myProducts = await api.getProducts({ farmer: user._id });
      setProducts(myProducts || []);

      const myReviews = await api.getFarmerReviews(user._id);
      setReviews(myReviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Order status actions
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      alert(`Order updated to: ${status.replace(/_/g, ' ').toUpperCase()}`);
      loadFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  // Stock CRUD actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      stock_quantity: '',
      description: '',
      image: '',
      isRecurringTemplate: true,
      harvestDay: 'Friday Morning'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category?.name || prod.category || 'Vegetables',
      price: prod.price,
      unit: prod.unit,
      stock_quantity: prod.stock_quantity ?? prod.stockQuantity ?? 0,
      description: prod.description || '',
      image: prod.image || '',
      isRecurringTemplate: !!prod.isRecurringTemplate,
      harvestDay: prod.harvestDay || 'Friday Morning'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, productForm);
        alert('Product updated successfully!');
      } else {
        await api.createProduct(productForm);
        alert('Product listed successfully!');
      }
      setIsProductModalOpen(false);
      loadFarmerData();
    } catch (err) {
      alert(err.message || 'Failed to save product.');
    }
  };

  const handleToggleSoldOut = async (productId) => {
    try {
      await api.toggleSoldOut(productId);
      loadFarmerData();
    } catch (err) {
      alert('Error changing sold out status.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      await api.deleteProduct(productId);
      loadFarmerData();
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  // Reply review action
  const handleReplyReview = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      await api.replyReview(reviewId, replyText);
      alert('Reply sent to customer review!');
      setReplyingReviewId(null);
      setReplyText('');
      loadFarmerData();
    } catch (err) {
      alert('Failed to submit reply.');
    }
  };

  // Save profile action
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      alert('Farmer Stall profile updated!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.order_status !== 'cancelled' ? o.total_amount : 0), 0);
  const pendingOrders = orders.filter(o => o.order_status === 'placed' || o.order_status === 'accepted');

  if (!user) return null;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="glass-panel p-4 p-lg-5 mb-4 border">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-success text-white px-3 py-1 rounded-pill fw-semibold mb-2">
              GROWER & VENDOR CONSOLE
            </span>
            <h2 className="fw-bold mb-1" style={{ color: '#0f2e1a' }}>
              {user.stallName || `${user.name}'s Farm Stall`}
            </h2>
            <div className="text-muted small">
              Market Pickup Window: <strong>{user.pickupTimeWindows || '08:00 AM - 01:00 PM'}</strong> • Operating Days: <strong>{(user.operatingDays || ['Saturday', 'Sunday']).join(', ')}</strong>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="btn btn-egreen rounded-pill"
            >
              <i className="bi bi-plus-circle me-1"></i> Add Harvest Item
            </button>
          </div>
        </div>
      </div>

      {/* KPI Insight Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-4 border shadow-xs">
            <div className="small text-muted fw-semibold">Total Revenue</div>
            <div className="fs-3 fw-bold text-success">${totalRevenue.toFixed(2)}</div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Paid in-person at stall</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-4 border shadow-xs">
            <div className="small text-muted fw-semibold">Pending Pre-Orders</div>
            <div className="fs-3 fw-bold text-warning">{pendingOrders.length}</div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Awaiting pack or pickup</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-4 border shadow-xs">
            <div className="small text-muted fw-semibold">Active Listings</div>
            <div className="fs-3 fw-bold text-primary">{products.length}</div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>In weekly catalog</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white rounded-4 border shadow-xs">
            <div className="small text-muted fw-semibold">Customer Reviews</div>
            <div className="fs-3 fw-bold text-dark">{reviews.length}</div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Feedback & ratings</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 bg-light p-2 rounded-4 border gap-1">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'orders' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Incoming Pre-Orders ({orders.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'stock' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('stock')}
          >
            🥕 Weekly Stock & Pricing ({products.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'reviews' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Customer Reviews ({reviews.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'profile' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('profile')}
          >
            ⚙️ Stall Settings & Location
          </button>
        </li>
      </ul>

      {/* TAB 1: INCOMING PRE-ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <h4 className="fw-bold mb-3">Incoming Customer Pre-Orders</h4>
          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No pre-orders placed yet. Ensure your harvest catalog is updated so customers can reserve items!
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map(ord => (
                <div key={ord._id} className="p-3 border rounded-3 bg-light">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <div>
                      <span className="fw-bold">Order #{ord.orderNumber}</span>
                      <span className={`badge ms-2 badge-status-${ord.order_status || 'placed'}`}>
                        {(ord.order_status || 'placed').replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <div className="small text-muted mt-1">
                        Customer: <strong>{ord.customerName}</strong> ({ord.customerEmail}) • Phone: {ord.customerPhone || 'N/A'}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fs-5 fw-bold text-success">${Number(ord.total_amount).toFixed(2)}</div>
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Collect at stall pickup</div>
                    </div>
                  </div>

                  <div className="row g-2 small p-2 bg-white rounded-3 border mb-2">
                    <div className="col-12 col-md-6">
                      <strong>📅 Pickup Date:</strong> {ord.pickupDate}
                    </div>
                    <div className="col-12 col-md-6">
                      <strong>⏰ Time Window:</strong> {ord.pickupTimeSlot}
                    </div>
                    {ord.specialInstructions && (
                      <div className="col-12 text-secondary">
                        <strong>Customer Note:</strong> "{ord.specialInstructions}"
                      </div>
                    )}
                  </div>

                  <div className="small mb-3">
                    <strong>Reserved Items:</strong>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {ord.items?.map((it, idx) => (
                        <span key={idx} className="badge bg-white text-dark border">
                          {it.name} × {it.quantity} {it.unit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Farmer Action Buttons */}
                  <div className="d-flex flex-wrap gap-2 justify-content-end border-top pt-2">
                    {ord.order_status === 'placed' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord._id, 'accepted')}
                          className="btn btn-sm btn-success rounded-pill"
                        >
                          ✓ Accept Pre-Order
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(ord._id, 'cancelled')}
                          className="btn btn-sm btn-outline-danger rounded-pill"
                        >
                          ✕ Decline Order
                        </button>
                      </>
                    )}

                    {ord.order_status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(ord._id, 'ready_for_pickup')}
                        className="btn btn-sm btn-primary rounded-pill"
                      >
                        📦 Mark Ready for Pickup
                      </button>
                    )}

                    {ord.order_status === 'ready_for_pickup' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateOrderStatus(ord._id, 'completed')}
                        className="btn btn-sm btn-success rounded-pill"
                      >
                        ✓ Customer Picked Up & Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WEEKLY STOCK & PRICING */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-0">Weekly Produce Stock Management</h4>
              <p className="small text-muted mb-0">Set up recurring stock templates, adjust quantities, or mark items sold out.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="btn btn-sm btn-egreen rounded-pill"
            >
              + New Item
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light small">
                <tr>
                  <th>Produce Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Available</th>
                  <th>Status</th>
                  <th>Recurring</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const stockRemaining = p.stock_quantity ?? p.stockQuantity ?? 0;
                  return (
                    <tr key={p._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=60&q=80'}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=60&q=80';
                            }}
                            className="rounded-2 object-fit-cover"
                            style={{ width: '42px', height: '42px' }}
                          />
                          <div>
                            <div className="fw-bold small">{p.name}</div>
                            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Harvest: {p.harvestDay || 'Weekly'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {p.category?.name || p.category}
                        </span>
                      </td>
                      <td className="fw-bold text-success">${Number(p.price).toFixed(2)} / {p.unit}</td>
                      <td>
                        <span className={`fw-bold ${stockRemaining > 5 ? 'text-success' : 'text-danger'}`}>
                          {stockRemaining} {p.unit}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleSoldOut(p._id)}
                          className={`btn btn-sm py-0 rounded-pill ${p.isSoldOut || stockRemaining <= 0 ? 'btn-danger' : 'btn-outline-success'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {p.isSoldOut || stockRemaining <= 0 ? 'Sold Out' : 'Available'}
                        </button>
                      </td>
                      <td>
                        <span className="small text-muted">{p.isRecurringTemplate ? '✓ Yes' : 'No'}</span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="btn btn-sm btn-outline-secondary me-1"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p._id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <h4 className="fw-bold mb-3">Customer Reviews & Replies</h4>
          {reviews.length === 0 ? (
            <div className="text-center py-5 text-muted">No customer reviews yet.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map(r => (
                <div key={r._id} className="p-3 border rounded-3 bg-light">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold small">{r.customerName}</span>
                    <span className="text-warning small">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="small text-dark mb-2">"{r.comment}"</p>

                  {r.farmerReply ? (
                    <div className="p-2 bg-success-subtle rounded small border-start border-success border-3">
                      <strong>Your Reply:</strong> {r.farmerReply}
                    </div>
                  ) : replyingReviewId === r._id ? (
                    <div className="mt-2">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Write your response to customer..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleReplyReview(r._id)}
                          className="btn btn-sm btn-success"
                        >
                          Send Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyingReviewId(null)}
                          className="btn btn-sm btn-light"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingReviewId(r._id);
                        setReplyText('');
                      }}
                      className="btn btn-sm btn-outline-success rounded-pill"
                    >
                      <i className="bi bi-reply"></i> Reply to Customer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STALL PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <h4 className="fw-bold mb-3">Stall Settings & Pickup Windows</h4>
          <form onSubmit={handleSaveProfile}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="small fw-semibold text-muted mb-1">Stall / Business Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.stallName}
                  onChange={e => setProfileForm({ ...profileForm, stallName: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="small fw-semibold text-muted mb-1">Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.contactPerson}
                  onChange={e => setProfileForm({ ...profileForm, contactPerson: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="small fw-semibold text-muted mb-1">Pickup Time Windows</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 08:00 AM - 01:00 PM"
                  value={profileForm.pickupTimeWindows}
                  onChange={e => setProfileForm({ ...profileForm, pickupTimeWindows: e.target.value })}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="small fw-semibold text-muted mb-1">Order Cutoff Hours (Before Pickup)</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileForm.orderCutoffHours}
                  onChange={e => setProfileForm({ ...profileForm, orderCutoffHours: Number(e.target.value) })}
                />
              </div>
              <div className="col-12">
                <label className="small fw-semibold text-muted mb-1">Stall Location / Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.address}
                  onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="small fw-semibold text-muted mb-1">Farm Bio / Sustainable Practices Story</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-egreen px-4">
                Save Stall Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4">
              <div className="modal-header border-0 p-0 mb-3">
                <h5 className="fw-bold mb-0">
                  {editingProduct ? 'Edit Harvest Product' : 'Add New Fresh Harvest Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setIsProductModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="row g-3">
                  <div className="col-12 col-md-8">
                    <label className="small fw-semibold text-muted mb-1">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Organic Beefsteak Tomatoes"
                      value={productForm.name}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="small fw-semibold text-muted mb-1">Category</label>
                    <select
                      className="form-select"
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Honey & Preserves">Honey & Preserves</option>
                      <option value="Herbs & Greens">Herbs & Greens</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-4">
                    <label className="small fw-semibold text-muted mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      placeholder="4.50"
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-4">
                    <label className="small fw-semibold text-muted mb-1">Unit</label>
                    <select
                      className="form-select"
                      value={productForm.unit}
                      onChange={e => setProductForm({ ...productForm, unit: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="bunch">bunch</option>
                      <option value="dozen">dozen</option>
                      <option value="basket">basket</option>
                      <option value="jar">jar</option>
                      <option value="loaf">loaf</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="small fw-semibold text-muted mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="30"
                      value={productForm.stock_quantity}
                      onChange={e => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="small fw-semibold text-muted mb-1">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.image}
                      onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="small fw-semibold text-muted mb-1">Harvest Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Describe crunch, sweetness, organic cultivation..."
                      value={productForm.description}
                      onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="recurringCheck"
                        checked={productForm.isRecurringTemplate}
                        onChange={e => setProductForm({ ...productForm, isRecurringTemplate: e.target.checked })}
                      />
                      <label className="form-check-label small" htmlFor="recurringCheck">
                        Set as Weekly Recurring Stock Template (Auto-resets stock every cycle)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light" onClick={() => setIsProductModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save Product
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
