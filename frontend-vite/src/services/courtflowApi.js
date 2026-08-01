/**
 * CourtFlow — API Service
 * Axios instance with token interceptor and refresh logic.
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_COURTFLOW_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cf_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('cf_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        localStorage.setItem('cf_access_token', newAccessToken);

        if (data.data.refreshToken) {
          localStorage.setItem('cf_refresh_token', data.data.refreshToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('cf_access_token');
        localStorage.removeItem('cf_refresh_token');
        localStorage.removeItem('cf_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ───────────────────────────────────────

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
};

// ─── Users API ──────────────────────────────────────

export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  getSavedClubs: () => api.get('/users/me/saved-clubs'),
  saveClub: (clubId) => api.post(`/users/me/saved-clubs/${clubId}`),
  unsaveClub: (clubId) => api.delete(`/users/me/saved-clubs/${clubId}`),
};

// ─── Clubs API ──────────────────────────────────────

export const clubsApi = {
  list: (params) => api.get('/clubs', { params }),
  getById: (id) => api.get(`/clubs/${id}`),
  getMyClubs: () => api.get('/clubs/my'),
  create: (data) => api.post('/clubs', data),
  update: (id, data) => api.patch(`/clubs/${id}`, data),
  delete: (id) => api.delete(`/clubs/${id}`),
  getStats: (id) => api.get(`/clubs/${id}/stats`),
};

// ─── Courts API ─────────────────────────────────────

export const courtsApi = {
  getById: (id) => api.get(`/courts/${id}`),
  create: (clubId, data) => api.post(`/clubs/${clubId}/courts`, data),
  update: (id, data) => api.patch(`/courts/${id}`, data),
  delete: (id) => api.delete(`/courts/${id}`),
  getAvailability: (id, params) =>
    api.get(`/courts/${id}/availability`, { params }),
};

// ─── Bookings API ───────────────────────────────────

export const bookingsApi = {
  create: (data) => api.post('/bookings', data),
  list: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  reschedule: (id, data) => api.patch(`/bookings/${id}/reschedule`, data),
  checkConflict: (params) => api.get('/bookings/check-conflict', { params }),
  getUpcoming: () => api.get('/bookings/upcoming'),
  getHistory: () => api.get('/bookings/history'),
};

// ─── Payments API ───────────────────────────────────

export const paymentsApi = {
  getById: (id) => api.get(`/payments/${id}`),
  processPayment: (bookingId, data) => api.post(`/payments/${bookingId}/pay`, data),
  refund: (id, reason) => api.post(`/payments/${id}/refund`, { reason }),
};

// ─── Notifications API ─────────────────────────────

export const notificationsApi = {
  list: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// ─── Dashboard API ──────────────────────────────────

export const dashboardApi = {
  getOwnerDashboard: () => api.get('/dashboard/owner'),
  getPlayerDashboard: () => api.get('/dashboard/player'),
};

// ─── Admin API ──────────────────────────────────────

export const adminApi = {
  listUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),
  listClubs: (params) => api.get('/admin/clubs', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;

