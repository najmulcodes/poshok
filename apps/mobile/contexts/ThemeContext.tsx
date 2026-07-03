import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from './colors';

type Theme = 'light' | 'dark';
type ThemePreference = Theme | 'system';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  colors: typeof lightColors;
  setThemePreference: (theme: ThemePreference) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nevo_theme_preference';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const [themePreference, _setThemePreference] = useState<ThemePreference>('system');
  const [theme, setTheme] = useState<Theme>(systemColorScheme);

  useEffect(() => {
    const loadThemePreference = async () => {
      const storedPref = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
      if (storedPref) {
        _setThemePreference(storedPref);
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themePreference === 'system') {
      setTheme(systemColorScheme);
    } else {
      setTheme(themePreference);
    }
  }, [themePreference, systemColorScheme]);

  const setThemePreference = async (newPreference: ThemePreference) => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
    _setThemePreference(newPreference);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, themePreference, colors, setThemePreference, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};