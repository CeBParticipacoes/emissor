import axios from 'axios';

/** Cliente HTTP único. Todas as chamadas em src/api/*.ts passam por aqui. */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

// Anexa o JWT em toda requisição, se houver.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
