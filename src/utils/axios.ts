import axios from 'axios';
// import { BASE_URL } from './sources';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const axiosMapInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAP_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (
    config.method === 'get' &&
    config.url?.includes('/company-and-app-data')
  ) {
    return config;
  }
  if (!config.url?.includes('auth/local')) {
    const token = localStorage.getItem('token');
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosMapInstance.interceptors.request.use(async (config) => {
  if (!config.url?.includes('auth/local')) {
    const token = localStorage.getItem('token');
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Content-Type'] = 'application/json';
    config.headers['Access-Control-Allow-Origin'] = '*';
  }
  return config;
});

export { axiosInstance, axiosMapInstance };
