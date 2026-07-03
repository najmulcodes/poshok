import { Stack } from 'expo-router';
import { useTranslation } from '@/constants/i18n';

export default function FavoritesLayout() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('Mobile.myFavorites') }} />
    </Stack>
  );
}