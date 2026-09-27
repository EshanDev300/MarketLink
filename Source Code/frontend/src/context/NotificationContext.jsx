import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setAnnouncements([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
      setAnnouncements(data.announcements || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // Ignore background notification fetch errors
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Polling every 15s for new alerts
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const showToast = (title, message, type = 'success') => {
    setToastMessage({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      announcements,
      unreadCount,
      refreshNotifications: fetchNotifications,
      markAsRead,
      markAllRead,
      showToast,
      toastMessage,
      closeToast: () => setToastMessage(null)
    }}>
      {children}
      {toastMessage && (
        <div 
          className="position-fixed top-0 end-0 p-3" 
          style={{ zIndex: 999999, maxWidth: '380px' }}
        >
          <div className={`toast show align-items-center text-white bg-${toastMessage.type === 'error' ? 'danger' : 'success'} border-0 shadow-lg rounded-4 p-2`}>
            <div className="d-flex">
              <div className="toast-body">
                <strong>{toastMessage.title}</strong>
                <div className="small text-white-50">{toastMessage.message}</div>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => setToastMessage(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
