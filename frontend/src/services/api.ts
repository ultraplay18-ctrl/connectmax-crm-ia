import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar Access Token e x-tenant-id nas requisições
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    const tenantId = Cookies.get('tenantId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para lidar com erro 401 e tentar Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('Sem refresh token');
        }

        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });

        if (res.data.accessToken) {
          Cookies.set('accessToken', res.data.accessToken, { expires: 1 });
          if (res.data.refreshToken) {
            Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 });
          }

          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('tenantId');
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
