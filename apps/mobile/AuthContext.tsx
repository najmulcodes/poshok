import { createContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '@prisma/client';
import apiFetch from '@/lib/api';
import * as tokenStorage from './tokenStorage';

interface User {
  id: string;
  email: string;
  role: Role;
  healthProfile: any; // Replace with actual HealthProfile type
  subscriptions: any[]; // Replace with actual Subscription type
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await tokenStorage.getToken();
      if (storedToken) {
        setToken(storedToken);
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await apiFetch('/users/me');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user, logging out.', error);
        logout();
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { accessToken } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await tokenStorage.setToken(accessToken);
    setToken(accessToken);
  };

  const logout = async () => {
    await tokenStorage.removeToken();
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}