import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8800',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // guardaremos aquí
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
