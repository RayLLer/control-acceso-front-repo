import axios from 'axios';
// import { BASE_URL } from './sources';
import secureStorage from 'react-secure-storage'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const axiosBaseInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  if (
    config.method === 'get' &&
    config.url?.includes('/company-and-app-data')
  ) {
    return config;
  }
  if (!config.url?.includes('auth/local')) {
    const token = secureStorage.getItem('token');
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});



export { axiosInstance, axiosBaseInstance };
