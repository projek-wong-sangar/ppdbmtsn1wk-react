import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const WILAYAH_API_URL = import.meta.env.VITE_WILAYAH_API_URL;

if (!API_BASE_URL) {
  throw new Error('Missing environment variable: VITE_API_URL');
}

if (!WILAYAH_API_URL) {
  throw new Error('Missing environment variable: VITE_WILAYAH_API_URL');
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// API khusus untuk wilayah
export const wilayahApi = axios.create({
  baseURL: WILAYAH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT interceptor untuk api utama
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
