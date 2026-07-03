'use client';

import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Role } from 'shared';
import apiFetch from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('poshok_token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await apiFetch('/users/me', { token });
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
        // Token might be expired, clear it
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { accessToken } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('nevo_token', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('nevo_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user]);

  const value = { user, token, login, logout, loading, isAdmin };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}