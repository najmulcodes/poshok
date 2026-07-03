import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Link, useIsFocused } from 'expo-router';
import apiFetch from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

interface DietPlanSummary {
  id: string;
  titleEn: string;
  titleBn: string;
  ageGroup?: string;
  condition: string;
}

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [plans, setPlans] = useState<DietPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritePlans = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/users/me/favorites');
        setPlans(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load favorite plans.');
      } finally {
        setLoading(false);
      }
    };

    // Refetch when the screen comes into focus
    if (isFocused) {
      fetchFavoritePlans();
    }
  }, [isFocused]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/plans/${item.id}`} asChild>
            <TouchableOpacity style={styles.planItem}>
              <Text style={styles.planTitle}>{item.titleEn} / {item.titleBn}</Text>
              <Text style={styles.ageGroup}>{item.condition}{item.ageGroup ? ` (${item.ageGroup.replace('_', ' ')})` : ''}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('Mobile.noFavorites')}</Text>}
        contentContainerStyle={plans.length === 0 ? styles.centered : { paddingTop: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  planItem: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginHorizontal: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  planTitle: { fontSize: 18, fontWeight: '600' },
  ageGroup: { fontSize: 14, color: '#6c757d', marginTop: 4, textTransform: 'capitalize' },
  emptyText: { fontSize: 16, color: '#6c757d' },
});