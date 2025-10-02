import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import "dotenv";
import process from 'process';

let inMemoryToken: string | null = null;
let logoutHandler: (() => void) | null = null;

export const setAuthToken = (token: string) => {
  inMemoryToken = token;
};

export const clearAuthToken = () => {
  inMemoryToken = null;
};

export const setLogoutHandler = (callback: () => void) => {
  logoutHandler = callback;
};

export const getBaseURL = (): string => {
  const env = process.env.REACT_APP_ENV?.toLowerCase();
  switch (env) {
    case 'it':
      return process.env.REACT_APP_API_URL_IT ?? '';
    case 'uat':
      return process.env.REACT_APP_API_URL_UAT ?? '';
    case 'prod':
    case 'production':
      return process.env.REACT_APP_API_URL_PROD ?? '';
    default:
      return '/api'; // Use vite proxy
  }
};

// Axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const cfg = config as InternalAxiosRequestConfig;
    if (inMemoryToken) cfg.headers['Authorization'] = `Bearer ${inMemoryToken}`;

    // // Logging
    console.groupCollapsed(`API Request: ${cfg.method?.toUpperCase()} ${cfg.url}`);
    console.log('Headers:', cfg.headers);
    if (cfg.data) 
      console.log('Body:', cfg.data);
    console.groupEnd();

    return cfg;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.groupCollapsed(`API Response: ${response.config.url}`);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      clearAuthToken();
      // Smooth SPA redirect
      if (logoutHandler) logoutHandler();
    }
    return Promise.reject(error);
  }
);

export default api;



