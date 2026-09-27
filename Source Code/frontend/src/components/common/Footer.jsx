import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketLinkLogo from './MarketLinkLogo';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
      alert('🌱 Subscribed! You will receive weekly harvest drop alerts every Friday morning.');
    }, 1200);
  };

  return (
    <footer className="footer-marketlink mt-auto position-relative overflow-hidden">
      {/* Decorative Top Glow Border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.6), transparent)',
          boxShadow: '0 0 15px rgba(52, 211, 153, 0.4)'
        }}
      />

      <div className="container py-5">
        <div className="row g-5 pb-5 border-bottom border-success border-opacity-25">
          {/* Column 1: Brand & Eco-Mission */}
          <div className="col-12 col-lg-4">
            <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <MarketLinkLogo size={42} />
              <div>
                <span className="fs-4 fw-extrabold text-white font-heading">Market<span className="text-success">Link</span></span>
                <div className="small text-white-50" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                  eGreen Basket Ecosystem
                </div>
              </div>
            </Link>

            <p className="small text-white-50 mb-4" style={{ lineHeight: '1.7', maxWidth: '340px' }}>
              Empowering regional organic growers and local communities through transparent harvest pre-orders. Zero middleman markups, 100% fair trade in-person pickup.
            </p>

            {/* Live Market Operations Badge */}
            <div className="p-2.5 rounded-3 d-inline-flex align-items-center gap-2 border border-success border-opacity-30 bg-success bg-opacity-10 mb-3">
              <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '8px', height: '8px' }}></span>
              <span className="small text-white fw-semibold" style={{ fontSize: '0.78rem' }}>
                4 Regional Farmers Markets Active
              </span>
            </div>

            <div className="d-flex gap-2">
              <span className="badge rounded-pill bg-dark border border-success border-opacity-25 text-success small px-2.5 py-1">
                🌱 100% Non-GMO
              </span>
              <span className="badge rounded-pill bg-dark border border-success border-opacity-25 text-success small px-2.5 py-1">
                🧺 Zero-Waste Crates
              </span>
            </div>
          </div>

          {/* Column 2: Discover & Catalog */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white mb-3 font-heading">Produce & Markets</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/products" className="footer-link">Heirloom Vegetables</Link></li>
              <li><Link to="/products" className="footer-link">Seasonal Orchard Fruits</Link></li>
              <li><Link to="/products" className="footer-link">Pasture Dairy & Eggs</Link></li>
              <li><Link to="/products" className="footer-link">Artisanal Sourdough</Link></li>
              <li><Link to="/products" className="footer-link">Raw Mountain Honey</Link></li>
              <li><Link to="/markets" className="footer-link">Interactive Map & Hours</Link></li>
            </ul>
          </div>

          {/* Column 3: For Growers & Platform */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white mb-3 font-heading">For Farmers & Hubs</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/register" className="footer-link">List Your Farm Stall</Link></li>
              <li><Link to="/login" className="footer-link">Vendor Stall Dashboard</Link></li>
              <li><Link to="/about" className="footer-link">Why Zero Gateway Cuts</Link></li>
              <li><Link to="/contact" className="footer-link">Market Operations Desk</Link></li>
              <li><span className="text-white-50">Cutoff Window Policies</span></li>
              <li><span className="text-white-50">Farmer Quality Standards</span></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Harvest Alerts */}
          <div className="col-12 col-md-6 col-lg-4">
            <h6 className="fw-bold text-white mb-2 font-heading">Weekly Dawn Harvest Drops</h6>
            <p className="small text-white-50 mb-3" style={{ lineHeight: '1.6' }}>
              Subscribe to get notified every Friday morning when local farmers post their freshly harvested inventories.
            </p>

            <form onSubmit={handleSubscribe} className="mb-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control form-control-sm rounded-start-pill px-3 border-0"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  required
                  style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="btn btn-sm btn-egreen rounded-end-pill px-3"
                >
                  {subscribed ? 'Joined!' : 'Subscribe'}
                </button>
              </div>
            </form>

            <div className="small text-white-50" style={{ fontSize: '0.72rem' }}>
              🔒 No spam ever. Unsubscribe at any time. We respect your inbox.
            </div>
          </div>
        </div>

        {/* Bottom Credits & TechWiz 7 Verification */}
        <div className="pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-white-50">
          <div className="d-flex align-items-center gap-2">
            <span>© {new Date().getFullYear()} MarketLink (eGreen Basket).</span>
            <span className="badge rounded-pill bg-success bg-opacity-20 text-success border border-success border-opacity-25 px-2 py-0.5" style={{ fontSize: '0.68rem' }}>
              TechWiz 7 Project
            </span>
          </div>

          <div className="d-flex flex-wrap gap-3">
            <Link to="/about" className="footer-link">SRS Alignment</Link>
            <span className="text-white-50">•</span>
            <Link to="/markets" className="footer-link">OpenStreetMap</Link>
            <span className="text-white-50">•</span>
            <Link to="/contact" className="footer-link">Support Helpline</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
