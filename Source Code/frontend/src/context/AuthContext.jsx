import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('marketlink_token');
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.error('Failed to load user session:', err);
          localStorage.removeItem('marketlink_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem('marketlink_token', res.token);
    setUser(res.user);
    return res.user;
  };

  // Quick Demo Login for judges/evaluators
  const quickLogin = async (role) => {
    const demoAccounts = {
      admin: { identifier: 'admin@marketlink.com', password: 'admin123' },
      farmer: { identifier: 'greenvalley@marketlink.com', password: 'farmer123' },
      customer: { identifier: 'priya@marketlink.com', password: 'customer123' }
    };

    const creds = demoAccounts[role];
    if (creds) {
      return await login(creds);
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('marketlink_token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('marketlink_token');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
    return res.user;
  };

  const toggleFavorite = async (type, id) => {
    if (!user) return false;
    const res = await api.toggleFavorite(type, id);
    setUser(prev => ({
      ...prev,
      favoriteFarmers: res.favoriteFarmers,
      favoriteProducts: res.favoriteProducts
    }));
    return res.isFavorite;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      quickLogin,
      register,
      logout,
      updateProfile,
      toggleFavorite,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isFarmer: user?.role === 'farmer',
      isCustomer: user?.role === 'customer'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
