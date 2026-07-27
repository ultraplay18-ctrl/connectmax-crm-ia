import axios from 'axios';
import Cookies from 'js-cookie';

function getApiBaseUrl(): string {
  // 1. Variável de Ambiente NEXT_PUBLIC_API_URL
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== '' && envUrl !== 'undefined') {
    const cleaned = envUrl.trim().replace(/\/+$/, '');
    return cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
  }

  // 2. Se estiver rodando no navegador em produção (Vercel ou outro domínio remoto)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://connectmax-crm-ia.onrender.com/api/v1';
  }

  // 3. Fallback apenas para desenvolvimento local
  return 'http://localhost:3001/api/v1';
}

const API_URL = getApiBaseUrl();

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
    // Garante que o baseURL da requisição utilize o URL correto em tempo de execução
    config.baseURL = getApiBaseUrl();

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

        const currentBaseUrl = getApiBaseUrl();
        const res = await axios.post(`${currentBaseUrl}/auth/refresh`, { refreshToken }, { withCredentials: true });

        if (res.data.accessToken) {
          const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
          const cookieOptions: Cookies.CookieAttributes = {
            path: '/',
            secure: isSecure,
            sameSite: 'lax',
          };

          Cookies.set('accessToken', res.data.accessToken, { ...cookieOptions, expires: 1 });
          if (res.data.refreshToken) {
            Cookies.set('refreshToken', res.data.refreshToken, { ...cookieOptions, expires: 7 });
          }

          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        Cookies.remove('tenantId', { path: '/' });
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
