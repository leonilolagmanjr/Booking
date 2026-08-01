import apiClient from './apiClient';

export const venueService = {
  list: (params) => apiClient.get('/clubs', { params }),
  getById: (id) => apiClient.get(`/clubs/${id}`),
  getMyVenues: () => apiClient.get('/clubs/my'),
  create: (data) => apiClient.post('/clubs', data),
  update: (id, data) => apiClient.patch(`/clubs/${id}`, data),
  delete: (id) => apiClient.delete(`/clubs/${id}`),
  getStats: (id) => apiClient.get(`/clubs/${id}/stats`),
  getSaved: () => apiClient.get('/users/me/saved-clubs'),
  save: (clubId) => apiClient.post(`/users/me/saved-clubs/${clubId}`),
  unsave: (clubId) => apiClient.delete(`/users/me/saved-clubs/${clubId}`),
};

