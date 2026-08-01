import apiClient from './apiClient';

export const dashboardService = {
  getOwnerDashboard: () => apiClient.get('/dashboard/owner'),
  getPlayerDashboard: () => apiClient.get('/dashboard/player'),
  getAdminDashboard: () => apiClient.get('/admin/analytics'),
};

