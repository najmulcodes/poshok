import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import apiFetch from '@/services/api';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/i18n';
import { getCommonStyles } from '@/constants/styles';

interface FavoriteEntry {
  id: string;
  dietPlan: {
    id: string;
    titleEn: string;
    titleBn: string;
    condition: string;
    ageGroup: string | null;
  };
}

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(colors);
  const [favorites, setFavorites] = useState<FavoriteEntry[] | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      const data = await apiFetch('/users/me/favorites');
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavorites([]);
    }
  }, []);

  // Refetch every time this screen comes into focus, since favorites can
  // change from the plan detail screen without this screen remounting.
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  if (favorites === null) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Mobile.myFavorites')}</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={favorites.length === 0 ? styles.centered : undefined}
        renderItem={({ item }) => (
          <Link href={`/plans/${item.dietPlan.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.planTitle}>{item.dietPlan.titleEn}</Text>
              <Text style={styles.planTitleBn}>{item.dietPlan.titleBn}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ color: colors.subtext }}>{t('Mobile.noFavorites')}</Text>}
      />
    </View>
  );
}

const getStyles = (colors: any) => {
  const commonStyles = getCommonStyles(colors);
  return StyleSheet.create({
    ...commonStyles,
    card: {
      ...commonStyles.card,
    },
    planTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
    planTitleBn: { fontSize: 14, color: colors.subtext, marginTop: 2 },
  });
};
