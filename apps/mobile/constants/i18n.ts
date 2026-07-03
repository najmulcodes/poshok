import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

// Import translations from the shared package
import en from '../../../packages/shared/translations/en.json';
import bn from '../../../packages/shared/translations/bn.json';

const i18n = new I18n({
  en,
  bn,
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode || 'en';
i18n.enableFallback = true;

// Helper hook for convenience
export const useTranslation = () => ({ t: i18n.t.bind(i18n) });