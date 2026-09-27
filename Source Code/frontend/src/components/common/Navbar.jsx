import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import MarketLinkLogo from './MarketLinkLogo';

export default function Navbar({ onOpenNotifications }) {
  const { user, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { unreadCount } = useNotification();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Automatically close mobile menu and profile dropdown whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky-top navbar-marketlink-wrapper">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-floating-pill px-3 py-2 my-2 my-lg-3 rounded-pill position-relative">
          {/* Shimmering Animated Shiny Border Glow */}
          <div className="navbar-shiny-sheen" />

          {/* Brand Logo */}
          <Link to="/" onClick={handleNavClick} className="navbar-brand-logo d-flex align-items-center gap-2.5 text-decoration-none">
            <div className="brand-logo-icon">
              <MarketLinkLogo size={42} />
            </div>
            <div>
              <div className="d-flex align-items-baseline">
                <span className="brand-title-green fs-4 fw-extrabold" style={{ letterSpacing: '-0.5px' }}>Market</span>
                <span className="brand-title-dark fs-4 fw-extrabold" style={{ letterSpacing: '-0.5px' }}>Link</span>
              </div>
              <div className="brand-subtext fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                🌿 eGreen Basket
              </div>
            </div>
          </Link>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler border-0 shadow-none p-1.5 rounded-circle ms-auto me-2 d-lg-none d-flex align-items-center justify-content-center"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
            style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)' }}
          >
            {isMobileMenuOpen ? (
              <i className="bi bi-x-lg fs-4 text-success"></i>
            ) : (
              <i className="bi bi-list fs-2 text-success"></i>
            )}
          </button>

          {/* Navigation Links */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarMarketLinkNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 align-items-center">
              <li className="nav-item">
                <NavLink to="/" onClick={handleNavClick} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/markets" onClick={handleNavClick} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  Markets & Map
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/products" onClick={handleNavClick} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  Fresh Produce
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" onClick={handleNavClick} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" onClick={handleNavClick} className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Right Action Controls */}
            <div className="d-flex align-items-center gap-2 justify-content-center pt-2 pt-lg-0">
              {/* Dark Mode Toggle Switch */}
              <button
                type="button"
                className="btn btn-theme-toggle rounded-circle border shadow-xs d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <i className="bi bi-sun-fill text-warning fs-6 animate-pulse-glow"></i>
                ) : (
                  <i className="bi bi-moon-stars-fill text-success fs-6"></i>
                )}
              </button>

              {/* In-app Notification Bell */}
              {user && (
                <button
                  type="button"
                  className="btn btn-nav-action position-relative rounded-circle border shadow-xs d-flex align-items-center justify-content-center"
                  style={{ width: '38px', height: '38px' }}
                  onClick={onOpenNotifications}
                  title="Notifications & Announcements"
                >
                  <i className="bi bi-bell text-secondary"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.62rem' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart Button */}
              <button
                type="button"
                className="btn btn-nav-action position-relative rounded-circle border shadow-xs d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                onClick={() => setIsCartOpen(true)}
                title="View Harvest Cart"
              >
                <i className="bi bi-basket2 text-success fs-6"></i>
                {totalItemsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success shadow-sm" style={{ fontSize: '0.62rem' }}>
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* User Profile Controlled Dropdown Menu */}
              {user ? (
                <div className="position-relative" ref={profileRef}>
                  <button
                    className="btn btn-egreen rounded-pill px-3 py-1.5 d-flex align-items-center gap-2 shadow-sm"
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    style={{ fontSize: '0.84rem' }}
                  >
                    <i className="bi bi-person-circle"></i>
                    <span className="fw-semibold">{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                    <span className="badge bg-white text-dark small">{user.role}</span>
                    <i className={`bi bi-chevron-${isProfileOpen ? 'up' : 'down'} small ms-0.5`}></i>
                  </button>

                  {/* Clean Dropdown Window outside navbar flow */}
                  {isProfileOpen && (
                    <div
                      className="dropdown-menu show shadow-lg border rounded-4 p-2 position-absolute end-0"
                      style={{
                        top: 'calc(100% + 10px)',
                        minWidth: '240px',
                        zIndex: 1090,
                        backgroundColor: 'var(--card-bg)',
                        borderColor: 'var(--card-border-glow)'
                      }}
                    >
                      <div className="px-3 py-2 border-bottom mb-2">
                        <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Signed in as</small>
                        <strong className="text-dark-emphasis text-truncate d-block small">{user.email}</strong>
                      </div>

                      {user.role === 'customer' && (
                        <Link 
                          to="/customer-dashboard" 
                          className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <i className="bi bi-speedometer2 text-success"></i> Customer Dashboard
                        </Link>
                      )}
                      {user.role === 'farmer' && (
                        <Link 
                          to="/farmer-dashboard" 
                          className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <i className="bi bi-shop text-success"></i> Farmer Stall Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin-dashboard" 
                          className="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <i className="bi bi-shield-check text-success"></i> Admin Console
                        </Link>
                      )}

                      <div className="dropdown-divider my-2"></div>

                      <button 
                        type="button"
                        className="dropdown-item py-2 rounded-3 text-danger d-flex align-items-center gap-2" 
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                      >
                        <i className="bi bi-box-arrow-right"></i> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3 ms-2">
                  <Link to="/login" onClick={handleNavClick} className="btn btn-sm btn-egreen-outline rounded-pill px-3 py-1.5 fw-semibold shadow-xs">
                    Log In
                  </Link>
                  <Link to="/register" onClick={handleNavClick} className="btn btn-sm btn-egreen rounded-pill px-3.5 py-1.5 fw-semibold shadow-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
