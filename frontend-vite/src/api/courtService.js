import apiClient from './apiClient';

export const courtService = {
  getById: (id) => apiClient.get(`/courts/${id}`),
  create: (venueId, data) => apiClient.post(`/clubs/${venueId}/courts`, data),
  update: (id, data) => apiClient.patch(`/courts/${id}`, data),
  delete: (id) => apiClient.delete(`/courts/${id}`),
  getAvailability: (id, params) =>
    apiClient.get(`/courts/${id}/availability`, { params }),
};

