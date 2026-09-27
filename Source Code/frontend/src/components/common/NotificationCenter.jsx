import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

/**
 * NotificationCenter Drawer
 * Features smooth open and close sliding animations identical to CartDrawer.
 */
export default function NotificationCenter({ isOpen, onClose }) {
  const { notifications, announcements, unreadCount, markAsRead, markAllRead } = useNotification();

  return (
    <>
      {/* Background Overlay with smooth fade */}
      <div 
        className={`notification-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sliding Drawer Container */}
      <div className={`notification-drawer ${isOpen ? 'open' : ''} p-4`}>
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-5">🔔</span>
            <h5 className="fw-bold mb-0 text-dark-emphasis font-heading">Alerts & Notices</h5>
          </div>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>

        {unreadCount > 0 && (
          <div className="d-flex justify-content-end mb-2">
            <button 
              type="button" 
              onClick={markAllRead}
              className="btn btn-link btn-sm text-success text-decoration-none p-0 small fw-semibold"
            >
              ✓ Mark all as read
            </button>
          </div>
        )}

        <div className="flex-grow-1 overflow-y-auto d-flex flex-column gap-3 pe-1">
          {/* Active Announcements */}
          {announcements.map((a) => (
            <div key={a._id} className="p-3 bg-success-subtle border border-success-subtle rounded-3 small">
              <div className="fw-bold text-success mb-1">📢 {a.title}</div>
              <div className="text-secondary">{a.message}</div>
            </div>
          ))}

          {/* User Order Notifications */}
          {notifications.length === 0 && announcements.length === 0 ? (
            <div className="text-center my-auto py-5 text-muted small">
              <div className="fs-1 mb-2">🌱</div>
              <div className="fw-bold text-dark-emphasis">All Caught Up!</div>
              <p className="text-secondary mt-1">When you pre-order fresh produce, live status alerts will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n._id} 
                className={`p-3 rounded-3 border small transition-all ${
                  n.read ? 'bg-body-tertiary text-muted' : 'border-success-subtle shadow-xs'
                }`}
                style={{ background: n.read ? undefined : 'var(--card-bg)' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-dark-emphasis">{n.title}</strong>
                  <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-secondary mb-2" style={{ lineHeight: '1.45' }}>{n.message}</div>
                <div className="d-flex justify-content-between align-items-center pt-1 border-top">
                  {n.link ? (
                    <Link 
                      to={n.link} 
                      className="text-success small fw-bold text-decoration-none"
                      onClick={() => {
                        markAsRead(n._id);
                        onClose();
                      }}
                    >
                      View Details →
                    </Link>
                  ) : <span />}

                  {!n.read && (
                    <button 
                      type="button" 
                      onClick={() => markAsRead(n._id)}
                      className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
                      style={{ fontSize: '0.72rem' }}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
