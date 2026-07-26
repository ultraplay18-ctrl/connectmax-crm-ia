'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '../services/api';
import { useRouter, usePathname } from 'next/navigation';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE';
  companyId: string;
  companyName?: string;
  settings?: {
    logo?: string;
    primaryColor?: string;
    timezone?: string;
    onboardingCompleted?: boolean;
    onboardingProgress?: number;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  registerCompany: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    console.log('[DEBUG Auth] Iniciando fetchCurrentUser...');
    const rawToken = Cookies.get('accessToken');
    const token = rawToken && rawToken !== 'undefined' && rawToken !== 'null' && rawToken.trim() !== '' ? rawToken : null;

    console.log('[DEBUG Auth] Token verificado:', token);
    if (!token) {
      console.log('[DEBUG Auth] Nenhum token válido encontrado. Setando loading para false.');
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('[DEBUG Auth] Buscando /users/me...');
      const response = await api.get('/users/me');
      console.log('[DEBUG Auth] Usuário obtido:', response.data);
      setUser(response.data);
      if (response.data.companyId) {
        Cookies.set('tenantId', response.data.companyId, { expires: 7, path: '/' });
      }
    } catch (error) {
      console.error('[DEBUG Auth] Erro ao buscar usuário:', error);
      setUser(null);
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('tenantId', { path: '/' });
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('tenantId');
    } finally {
      console.log('[DEBUG Auth] Finalizando fetchCurrentUser, loading = false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[DEBUG Auth] AuthProvider montado, chamando fetchCurrentUser');
    fetchCurrentUser();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken, user: userData } = response.data;

      Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
      Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
      if (userData.companyId) {
        Cookies.set('tenantId', userData.companyId, { expires: 7, path: '/' });
      }

      setUser(userData);
      router.replace('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerCompany = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const { accessToken, refreshToken, user: userData, company } = response.data;

      Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
      Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
      if (company?.id) {
        Cookies.set('tenantId', company.id, { expires: 7, path: '/' });
      }

      setUser({
        ...userData,
        companyName: company.name,
        settings: userData.settings,
      });

      if (userData.settings?.onboardingCompleted) {
        router.replace('/dashboard');
      } else {
        router.replace('/welcome');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignora erro no logout remoto
    } finally {
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('tenantId', { path: '/' });
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('tenantId');
      setUser(null);
      router.replace('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerCompany,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
