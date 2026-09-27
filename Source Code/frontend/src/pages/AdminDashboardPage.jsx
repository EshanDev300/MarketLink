import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'farmers', 'customers', 'markets', 'moderation', 'config'
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);
  const [moderationProducts, setModerationProducts] = useState([]);
  const [moderationReviews, setModerationReviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Market Modal
  const [marketModalOpen, setMarketModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [marketForm, setMarketForm] = useState({
    name: '',
    address: '',
    city: 'San Francisco',
    operatingDays: ['Saturday', 'Sunday'],
    timings: '08:00 AM - 01:30 PM',
    latitude: 37.7749,
    longitude: -122.4194,
    description: '',
    image: ''
  });

  // Announcement Form
  const [annForm, setAnnForm] = useState({
    title: '',
    message: '',
    type: 'info',
    audience: 'all'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      alert('Access restricted to Platform Administrators.');
      navigate('/');
      return;
    }
    loadAdminData();
  }, [user]);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [mStats, allUsers, allMkts, modProds, modRevs, anns] = await Promise.all([
        api.getAdminMetrics().catch(() => null),
        api.getAdminUsers().catch(() => []),
        api.getMarkets().catch(() => []),
        api.getModerationProducts().catch(() => []),
        api.getModerationReviews().catch(() => []),
        api.getAnnouncements().catch(() => [])
      ]);

      setMetrics(mStats);
      setUsersList(allUsers || []);
      setMarketsList(allMkts || []);
      setModerationProducts(modProds || []);
      setModerationReviews(modRevs || []);
      setAnnouncements(anns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Farmer / Customer Status Actions
  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      alert(`User status updated to ${newStatus}`);
      loadAdminData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Content Moderation Actions
  const handleRemoveProduct = async (id) => {
    if (!window.confirm('Moderation: Remove this product from platform?')) return;
    try {
      await api.removeProductModeration(id);
      alert('Product listing removed.');
      loadAdminData();
    } catch (err) {
      alert('Failed to remove product.');
    }
  };

  const handleRemoveReview = async (id) => {
    if (!window.confirm('Moderation: Delete this review for guideline violation?')) return;
    try {
      await api.removeReviewModeration(id);
      alert('Review removed.');
      loadAdminData();
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  // Market Actions
  const handleSaveMarket = async (e) => {
    e.preventDefault();
    try {
      if (editingMarket) {
        await api.updateMarket(editingMarket._id, marketForm);
        alert('Market updated successfully!');
      } else {
        await api.createMarket(marketForm);
        alert('Market added successfully!');
      }
      setMarketModalOpen(false);
      loadAdminData();
    } catch (err) {
      alert('Failed to save market.');
    }
  };

  const handleDeleteMarket = async (id) => {
    if (!window.confirm('Are you sure you want to remove this market?')) return;
    try {
      await api.deleteMarket(id);
      loadAdminData();
    } catch (err) {
      alert('Failed to delete market.');
    }
  };

  // Announcement Actions
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annForm.title || !annForm.message) return;
    try {
      await api.createAnnouncement(annForm);
      alert('Announcement published across platform!');
      setAnnForm({ title: '', message: '', type: 'info', audience: 'all' });
      loadAdminData();
    } catch (err) {
      alert('Failed to publish announcement.');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.deleteAnnouncement(id);
      loadAdminData();
    } catch (err) {
      alert('Failed to delete announcement.');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container py-5">
      {/* Title */}
      <div className="glass-panel p-4 p-lg-5 mb-4 border">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span className="badge bg-danger text-white px-3 py-1 rounded-pill fw-semibold mb-2">
              SYSTEM ELEVATED CONSOLE
            </span>
            <h2 className="fw-bold mb-1" style={{ color: '#0f2e1a' }}>Admin Operations Dashboard</h2>
            <div className="text-muted small">
              Platform Governance • Farmer Approval • Content Moderation • Master Data Configuration
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingMarket(null);
              setMarketForm({
                name: '',
                address: '',
                city: 'San Francisco',
                operatingDays: ['Saturday', 'Sunday'],
                timings: '08:00 AM - 01:30 PM',
                latitude: 37.7749,
                longitude: -122.4194,
                description: '',
                image: ''
              });
              setMarketModalOpen(true);
            }}
            className="btn btn-egreen rounded-pill"
          >
            + Add New Market
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white rounded-4 border shadow-xs text-center">
            <div className="small text-muted fw-semibold">Total Farmers</div>
            <div className="fs-3 fw-bold text-success">{metrics?.totalFarmers ?? 0}</div>
            <div className="small text-warning" style={{ fontSize: '0.72rem' }}>
              {metrics?.pendingFarmers ?? 0} pending review
            </div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white rounded-4 border shadow-xs text-center">
            <div className="small text-muted fw-semibold">Customers</div>
            <div className="fs-3 fw-bold text-primary">{metrics?.totalCustomers ?? 0}</div>
            <div className="small text-muted" style={{ fontSize: '0.72rem' }}>Registered shoppers</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white rounded-4 border shadow-xs text-center">
            <div className="small text-muted fw-semibold">Markets</div>
            <div className="fs-3 fw-bold text-success">{metrics?.totalMarkets ?? 0}</div>
            <div className="small text-muted" style={{ fontSize: '0.72rem' }}>Active map pins</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white rounded-4 border shadow-xs text-center">
            <div className="small text-muted fw-semibold">Products</div>
            <div className="fs-3 fw-bold text-dark">{metrics?.totalProducts ?? 0}</div>
            <div className="small text-muted" style={{ fontSize: '0.72rem' }}>Weekly listings</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white rounded-4 border shadow-xs text-center">
            <div className="small text-muted fw-semibold">Pre-Orders</div>
            <div className="fs-3 fw-bold text-dark">{metrics?.totalOrders ?? 0}</div>
            <div className="small text-muted" style={{ fontSize: '0.72rem' }}>Placed in system</div>
          </div>
        </div>
        <div className="col-6 col-md-2">
          <div className="p-3 bg-white rounded-4 border shadow-xs text-center">
            <div className="small text-muted fw-semibold">Total Sales</div>
            <div className="fs-3 fw-bold text-success">${Number(metrics?.totalRevenue ?? 0).toFixed(0)}</div>
            <div className="small text-muted" style={{ fontSize: '0.72rem' }}>In-person volume</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 bg-light p-2 rounded-4 border gap-1">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'overview' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Analytics & Reports
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'farmers' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('farmers')}
          >
            🧑‍🌾 Manage Farmers ({usersList.filter(u => u.role === 'farmer').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'customers' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('customers')}
          >
            👥 Manage Customers ({usersList.filter(u => u.role === 'customer').length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'markets' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('markets')}
          >
            📍 Manage Markets ({marketsList.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'moderation' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('moderation')}
          >
            🛡️ Content Moderation
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill fw-semibold ${activeTab === 'config' ? 'active bg-success text-white' : 'text-dark'}`}
            onClick={() => setActiveTab('config')}
          >
            📢 Announcements
          </button>
        </li>
      </ul>

      {/* TAB 1: ANALYTICS & REPORTS */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          {/* Revenue by Market */}
          <div className="col-12 col-md-6">
            <div className="p-4 bg-white rounded-4 border shadow-xs h-100">
              <h5 className="fw-bold mb-3">Revenue Across Farmers Markets</h5>
              <div className="d-flex flex-column gap-3">
                {Object.entries(metrics?.marketRevenue || {}).map(([mName, rev], idx) => (
                  <div key={idx} className="p-3 bg-light rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small">{mName}</span>
                      <span className="fw-bold text-success">${Number(rev).toFixed(2)}</span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${Math.min(100, (rev / (metrics?.totalRevenue || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Farmers by Sales Volume */}
          <div className="col-12 col-md-6">
            <div className="p-4 bg-white rounded-4 border shadow-xs h-100">
              <h5 className="fw-bold mb-3">Top Performing Active Farmers</h5>
              <div className="d-flex flex-column gap-3">
                {(metrics?.topFarmers || []).map((tf, idx) => (
                  <div key={idx} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success rounded-circle p-2">#{idx + 1}</span>
                      <span className="fw-bold small">{tf.name}</span>
                    </div>
                    <span className="fw-bold text-success fs-6">${Number(tf.sales).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE FARMERS */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <h4 className="fw-bold mb-3">Farmer Registrations & Verification</h4>
          <p className="small text-muted mb-4">
            According to SRS: Admin can view, approve, or suspend Farmer registrations before they can list products.
          </p>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light small">
                <tr>
                  <th>Farmer / Stall</th>
                  <th>Contact Email & Phone</th>
                  <th>Operating Days</th>
                  <th>Status</th>
                  <th className="text-end">Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.filter(u => u.role === 'farmer').map(f => (
                  <tr key={f._id}>
                    <td>
                      <div className="fw-bold">{f.stallName || f.name}</div>
                      <div className="small text-muted">{f.name}</div>
                    </td>
                    <td>
                      <div className="small">{f.email}</div>
                      <div className="small text-muted">{f.contactNumber || 'N/A'}</div>
                    </td>
                    <td>
                      <span className="small">{(f.operatingDays || []).join(', ') || 'Weekends'}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        f.status === 'active' ? 'bg-success' : f.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger'
                      }`}>
                        {f.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="text-end">
                      {f.status !== 'active' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserStatus(f._id, 'active')}
                          className="btn btn-sm btn-success rounded-pill me-1"
                        >
                          ✓ Approve
                        </button>
                      )}
                      {f.status !== 'suspended' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserStatus(f._id, 'suspended')}
                          className="btn btn-sm btn-outline-danger rounded-pill"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <h4 className="fw-bold mb-3">Customer Account Management</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light small">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone & Address</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.filter(u => u.role === 'customer').map(c => (
                  <tr key={c._id}>
                    <td className="fw-bold">{c.name}</td>
                    <td>{c.email}</td>
                    <td className="small text-muted">{c.contactNumber || 'N/A'} • {c.address || 'N/A'}</td>
                    <td>
                      <span className={`badge ${c.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {c.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="text-end">
                      {c.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserStatus(c._id, 'suspended')}
                          className="btn btn-sm btn-outline-danger rounded-pill"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateUserStatus(c._id, 'active')}
                          className="btn btn-sm btn-outline-success rounded-pill"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE MARKETS */}
      {activeTab === 'markets' && (
        <div className="bg-white rounded-4 border p-4 shadow-xs">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Farmers Markets Locations & Coordinates</h4>
            <button
              type="button"
              onClick={() => {
                setEditingMarket(null);
                setMarketModalOpen(true);
              }}
              className="btn btn-sm btn-egreen rounded-pill"
            >
              + Add Market
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light small">
                <tr>
                  <th>Market Name</th>
                  <th>City & Address</th>
                  <th>Coordinates (Lat, Lng)</th>
                  <th>Operating Days & Hours</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketsList.map(m => (
                  <tr key={m._id}>
                    <td className="fw-bold">{m.name}</td>
                    <td className="small">{m.city} — {m.address}</td>
                    <td className="small font-monospace">{Number(m.latitude).toFixed(4)}, {Number(m.longitude).toFixed(4)}</td>
                    <td className="small">
                      {(m.operatingDays || []).join(', ')} ({m.timings})
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMarket(m);
                          setMarketForm({
                            name: m.name,
                            address: m.address,
                            city: m.city || 'San Francisco',
                            operatingDays: m.operatingDays || ['Saturday', 'Sunday'],
                            timings: m.timings || '08:00 AM - 01:30 PM',
                            latitude: m.latitude,
                            longitude: m.longitude,
                            description: m.description || '',
                            image: m.image || ''
                          });
                          setMarketModalOpen(true);
                        }}
                        className="btn btn-sm btn-outline-secondary me-1"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMarket(m._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CONTENT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="row g-4">
          {/* Products Moderation */}
          <div className="col-12 col-lg-6">
            <div className="bg-white rounded-4 border p-4 shadow-xs h-100">
              <h5 className="fw-bold mb-3">Product Listings Moderation</h5>
              <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '450px' }}>
                {moderationProducts.map(p => (
                  <div key={p._id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3">
                    <div>
                      <div className="fw-bold small">{p.name}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Farmer: {p.farmerName} • ${Number(p.price).toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(p._id)}
                      className="btn btn-sm btn-outline-danger rounded-pill"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Moderation */}
          <div className="col-12 col-lg-6">
            <div className="bg-white rounded-4 border p-4 shadow-xs h-100">
              <h5 className="fw-bold mb-3">Customer Reviews Moderation</h5>
              <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '450px' }}>
                {moderationReviews.map(r => (
                  <div key={r._id} className="p-2 bg-light rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold">{r.customerName} → {r.farmerName}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReview(r._id)}
                        className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="small text-secondary mb-0">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS */}
      {activeTab === 'config' && (
        <div className="row g-4">
          <div className="col-12 col-md-5">
            <div className="bg-white rounded-4 border p-4 shadow-xs">
              <h5 className="fw-bold mb-3">Publish Platform Announcement</h5>
              <form onSubmit={handleCreateAnnouncement}>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Announcement Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Harvest Festival This Saturday"
                    value={annForm.title}
                    onChange={e => setAnnForm({ ...annForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Target Audience</label>
                  <select
                    className="form-select"
                    value={annForm.audience}
                    onChange={e => setAnnForm({ ...annForm, audience: e.target.value })}
                  >
                    <option value="all">Everyone (All Shoppers & Farmers)</option>
                    <option value="farmers">Farmers Only</option>
                    <option value="customers">Customers Only</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Notice Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Details about pickup changes, weather alerts, or seasonal stock..."
                    value={annForm.message}
                    onChange={e => setAnnForm({ ...annForm, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-egreen w-100">
                  Broadcast Announcement
                </button>
              </form>
            </div>
          </div>

          <div className="col-12 col-md-7">
            <div className="bg-white rounded-4 border p-4 shadow-xs h-100">
              <h5 className="fw-bold mb-3">Active Broadcast Announcements ({announcements.length})</h5>
              <div className="d-flex flex-column gap-3">
                {announcements.map(ann => (
                  <div key={ann._id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-bold small text-dark">{ann.title}</div>
                      <div className="text-secondary small">{ann.message}</div>
                      <span className="badge bg-secondary-subtle text-secondary small mt-1">
                        Audience: {ann.audience}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(ann._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Add/Edit Modal */}
      {marketModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1080 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-4">
              <div className="modal-header border-0 p-0 mb-3">
                <h5 className="fw-bold mb-0">
                  {editingMarket ? 'Edit Farmers Market' : 'Add New Farmers Market'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setMarketModalOpen(false)}></button>
              </div>

              <form onSubmit={handleSaveMarket}>
                <div className="row g-3">
                  <div className="col-12 col-md-8">
                    <label className="small fw-semibold text-muted mb-1">Market Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={marketForm.name}
                      onChange={e => setMarketForm({ ...marketForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="small fw-semibold text-muted mb-1">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={marketForm.city}
                      onChange={e => setMarketForm({ ...marketForm, city: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="small fw-semibold text-muted mb-1">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={marketForm.address}
                      onChange={e => setMarketForm({ ...marketForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="small fw-semibold text-muted mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={marketForm.latitude}
                      onChange={e => setMarketForm({ ...marketForm, latitude: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="small fw-semibold text-muted mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={marketForm.longitude}
                      onChange={e => setMarketForm({ ...marketForm, longitude: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="small fw-semibold text-muted mb-1">Timings</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 08:00 AM - 01:30 PM"
                      value={marketForm.timings}
                      onChange={e => setMarketForm({ ...marketForm, timings: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="small fw-semibold text-muted mb-1">Market Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={marketForm.image}
                      onChange={e => setMarketForm({ ...marketForm, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light" onClick={() => setMarketModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save Market
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
