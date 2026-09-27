import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpotlightCard from '../components/reactbits/SpotlightCard';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer' or 'farmer'
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
    // Farmer specific fields
    stallName: '',
    contactPerson: '',
    operatingDays: ['Saturday', 'Sunday'],
    pickupTimeWindows: '08:00 AM - 01:00 PM'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register({
        ...formData,
        role
      });
      alert('Registration successful! Welcome to MarketLink.');
      if (user.role === 'farmer') navigate('/farmer-dashboard');
      else navigate('/customer-dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <SpotlightCard className="p-4 p-lg-5 border shadow-sm rounded-4 bg-white">
            <div className="text-center mb-4">
              <div className="fs-1 mb-2">🌿</div>
              <h3 className="fw-bold mb-1" style={{ color: '#0f2e1a' }}>Join MarketLink</h3>
              <p className="small text-muted mb-0">Create your eGreen Basket account to start pre-ordering or selling</p>
            </div>

            {/* Role Switcher */}
            <div className="d-flex justify-content-center mb-4">
              <div className="btn-group p-1 bg-light rounded-pill border" role="group">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold ${
                    role === 'customer' ? 'btn-success text-white' : 'btn-light border-0'
                  }`}
                >
                  🧑‍🌾 I'm a Shopper / Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold ${
                    role === 'farmer' ? 'btn-success text-white' : 'btn-light border-0'
                  }`}
                >
                  🚜 I'm a Farmer / Vendor
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3 rounded-3">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="small fw-semibold text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="small fw-semibold text-muted mb-1">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. eleanor_v"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="small fw-semibold text-muted mb-1">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="small fw-semibold text-muted mb-1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="small fw-semibold text-muted mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={formData.contactNumber}
                    onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="small fw-semibold text-muted mb-1">Address / Street</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123 Farm Way, County"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                {/* Farmer specific fields (SRS requirements) */}
                {role === 'farmer' && (
                  <>
                    <div className="col-12 col-md-6">
                      <label className="small fw-semibold text-muted mb-1">Stall / Farm Business Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sunrise Organic Acres"
                        value={formData.stallName}
                        onChange={e => setFormData({ ...formData, stallName: e.target.value })}
                        required={role === 'farmer'}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="small fw-semibold text-muted mb-1">Contact Person (Farmer)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name of Primary Stall Operator"
                        value={formData.contactPerson}
                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                        required={role === 'farmer'}
                      />
                    </div>

                    <div className="col-12">
                      <label className="small fw-semibold text-muted mb-1">Pickup Time Windows</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 08:00 AM - 01:00 PM"
                        value={formData.pickupTimeWindows}
                        onChange={e => setFormData({ ...formData, pickupTimeWindows: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-egreen w-100 py-2 fs-6 rounded-pill"
                >
                  {loading ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer Stall' : 'Customer'}`}
                </button>
              </div>
            </form>

            <div className="text-center mt-4 small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-success fw-bold text-decoration-none">
                Log In Here
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
