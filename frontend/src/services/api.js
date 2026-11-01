import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL =
  rawApiUrl === '/api'
    ? '/api'
    : rawApiUrl.endsWith('/api')
    ? rawApiUrl
    : `${rawApiUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sweet_cake_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on admin route, can clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('sweet_cake_admin_token');
        localStorage.removeItem('sweet_cake_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

// Products API
export const fetchProducts = (params) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Orders API
export const createOrder = (orderData) => api.post('/orders', orderData);
export const fetchOrders = (params) => api.get('/orders', { params });
export const fetchOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, statusData) => api.put(`/orders/${id}/status`, statusData);
export const updateOrderPayment = (id, paymentData) => api.put(`/orders/${id}/payment`, paymentData);
export const submitOrderUtr = (id, utrData) => api.put(`/orders/${id}/utr`, utrData);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
export const fetchDashboardStats = () => api.get('/orders/stats/overview');

// Settings API
export const fetchSettings = () => api.get('/settings');
export const updateSettings = (settingsData) => api.put('/settings', settingsData);

// Auth API
export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const fetchAdminMe = () => api.get('/auth/me');
export const updateAdminCredentials = (data) => api.put('/auth/credentials', data);

// File Upload API
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;

