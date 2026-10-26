import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem('hotelpro_user') || 'null');
  if (stored?.token) config.headers.Authorization = `Bearer ${stored.token}`;
  return config;
});

// Readable error text from an Axios error
export const getError = (err) =>
  err.response?.data?.message || err.message || 'Something went wrong. Please try again.';

export default api;
