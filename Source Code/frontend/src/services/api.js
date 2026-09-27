const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getHeaders() {
  const token = localStorage.getItem('marketlink_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Network request failed');
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profile) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  toggleFavorite: (type, id) => request('/auth/favorites/toggle', { method: 'POST', body: JSON.stringify({ type, id }) }),
  getFarmers: () => request('/auth/farmers'),
  getFarmerById: (id) => request(`/auth/farmers/${id}`),

  // Markets
  getMarkets: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'undefined')
    );
    const qs = new URLSearchParams(cleanParams).toString();
    return request(`/markets${qs ? '?' + qs : ''}`);
  },
  getMarketById: (id) => request(`/markets/${id}`),
  createMarket: (market) => request('/markets', { method: 'POST', body: JSON.stringify(market) }),
  updateMarket: (id, market) => request(`/markets/${id}`, { method: 'PUT', body: JSON.stringify(market) }),
  deleteMarket: (id) => request(`/markets/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'undefined')
    );
    const qs = new URLSearchParams(cleanParams).toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  createProduct: (product) => request('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id, product) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  toggleSoldOut: (id) => request(`/products/${id}/toggle-soldout`, { method: 'PATCH' }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my-orders'),
  getFarmerOrders: () => request('/orders/farmer-orders'),
  updateOrderStatus: (id, status, reason) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) }),
  cancelOrder: (id, reason) => request(`/orders/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  modifyOrder: (id, updates) => request(`/orders/${id}/modify`, { method: 'PATCH', body: JSON.stringify(updates) }),
  reorder: (id) => request(`/orders/${id}/reorder`, { method: 'POST' }),

  // Reviews
  getProductReviews: (productId) => request(`/reviews/product/${productId}`),
  getFarmerReviews: (farmerId) => request(`/reviews/farmer/${farmerId}`),
  submitReview: (review) => request('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  replyReview: (id, reply) => request(`/reviews/${id}/reply`, { method: 'PATCH', body: JSON.stringify({ reply }) }),

  // Admin
  getAdminMetrics: () => request('/admin/metrics'),
  getAdminUsers: (role) => request(`/admin/users${role ? '?role=' + role : ''}`),
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getModerationProducts: () => request('/admin/content/products'),
  removeProductModeration: (id) => request(`/admin/content/products/${id}`, { method: 'DELETE' }),
  getModerationReviews: () => request('/admin/content/reviews'),
  removeReviewModeration: (id) => request(`/admin/content/reviews/${id}`, { method: 'DELETE' }),
  getCategories: () => request('/admin/categories'),
  createCategory: (cat) => request('/admin/categories', { method: 'POST', body: JSON.stringify(cat) }),
  getAnnouncements: () => request('/admin/announcements'),
  createAnnouncement: (ann) => request('/admin/announcements', { method: 'POST', body: JSON.stringify(ann) }),
  deleteAnnouncement: (id) => request(`/admin/announcements/${id}`, { method: 'DELETE' }),

  // AI Chat
  sendAIChat: (message) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', { method: 'POST' })
};
