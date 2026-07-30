import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/chat`, // adjust if needed
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getChats = () => API.get('/');
// FIX: getOrCreateChat must use POST /create and pass the otherUserId
export const getOrCreateChat = (otherUserId = null) => API.post('/create', { otherUserId });

export const getMessages = (chatId) => API.get(`/${chatId}/messages`);
export const sendMessage = (data) => API.post('/send', data);
// export const getGlobalChat = () => API.get('/global'); // REMOVED: Replaced by getOrCreateChat
