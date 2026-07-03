import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Role, HealthProfile } from 'shared';
import apiFetch from '@/lib/api';
import * as tokenStorage from './tokenStorage';

interface User {
  id: string;
  email: string;
  role: Role;
  healthProfile: HealthProfile | null;
  mealCompletions: { mealId: string }[];
  subscriptions: any[]; // Replace with actual Subscription type
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await tokenStorage.removeToken();
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const userData = await apiFetch('/users/me');
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user, logging out.', error);
      await logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

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
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const { accessToken } = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await tokenStorage.setToken(accessToken);
    setToken(accessToken);
  };

  const value = { user, token, login, logout, loading, refetchUser: fetchUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}