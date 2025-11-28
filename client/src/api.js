import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // <-- URL de tu backend en Vercel
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getEventos = async () => {
  const response = await api.get('/eventos');
  return response.data;
};

export default api;
