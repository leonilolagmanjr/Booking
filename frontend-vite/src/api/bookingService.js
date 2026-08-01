import apiClient from './apiClient';

export const bookingService = {
  create: (data) => apiClient.post('/bookings', data),
  list: (params) => apiClient.get('/bookings', { params }),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  cancel: (id, reason) => apiClient.patch(`/bookings/${id}/cancel`, { reason }),
  reschedule: (id, data) => apiClient.patch(`/bookings/${id}/reschedule`, data),
  checkConflict: (params) => apiClient.get('/bookings/check-conflict', { params }),
  getUpcoming: () => apiClient.get('/bookings/upcoming'),
  getHistory: () => apiClient.get('/bookings/history'),
};

