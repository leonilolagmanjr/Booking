import apiClient from './apiClient';

export const userService = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data) => apiClient.patch('/users/me', data),
};

