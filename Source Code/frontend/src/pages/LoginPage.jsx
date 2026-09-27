import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpotlightCard from '../components/reactbits/SpotlightCard';
import BorderGlow from '../components/reactbits/BorderGlow';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ identifier, password });
      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'farmer') navigate('/farmer-dashboard');
      else navigate('/customer-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <BorderGlow borderRadius="28px">
            <SpotlightCard className="p-4 p-lg-5 border-0 shadow-sm rounded-4 bg-white">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">🌱</div>
                <h3 className="fw-bold mb-1 font-heading text-dark-emphasis">Welcome Back</h3>
                <p className="small text-muted mb-0">Sign in to your MarketLink eGreen Basket account</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3 rounded-3">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="small fw-semibold text-muted mb-1">Email or Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter email or username"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="small fw-semibold text-muted mb-1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-egreen w-100 py-2.5 fs-6 rounded-pill shadow-sm"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </button>
              </form>

              <div className="text-center mt-4 small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-success fw-bold text-decoration-none">
                  Register Here
                </Link>
              </div>
            </SpotlightCard>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}
