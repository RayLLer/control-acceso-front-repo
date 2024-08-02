import { notification } from 'antd';
import axios from 'axios';
import { error } from 'console';
// import { BASE_URL } from './sources';
import secureStorage from 'react-secure-storage';

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      secureStorage.removeItem('token');
      secureStorage.removeItem('user');
      notification.error({
        message: 'Sesión expirada',
        description:
          'Por favor inicie sesión nuevamente, redirigiendo a la pantalla de inicio...',
      });
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 3000);
    }
  }
);

export { axiosInstance, axiosBaseInstance };
