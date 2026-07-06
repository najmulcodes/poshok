import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Link } from 'expo-router';
import apiFetch from '@/services/api';
import { useTranslation } from '@/constants/i18n';
import { useTheme } from '@/hooks/useTheme';
import { getCommonStyles } from '@/constants/styles';

interface DietPlanSummary {
  id: string;
  titleEn: string;
  titleBn: string;
  ageGroup?: string;
}

export default function ChildNutritionScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [plans, setPlans] = useState<DietPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Debounce API calls to avoid searching on every keystroke
    const handler = setTimeout(() => {
      setLoading(true);
      const fetchChildPlans = async () => {
        try {
          const params = new URLSearchParams({ condition: 'CHILD' });
          if (searchQuery) {
            params.append('q', searchQuery);
          }
          const data = await apiFetch(`/diet-plans?${params.toString()}`);
          setPlans(data);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to load child nutrition plans.');
        } finally {
          setLoading(false);
        }
      };

      fetchChildPlans();
    }, 500); // Wait 500ms after the user stops typing

    return () => {
      clearTimeout(handler); // Clean up the timeout
    };
  }, [searchQuery]); // Re-run the effect when the search query changes

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Mobile.childNutrition')}</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for plans..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/plans/${item.id}`} asChild>
            <TouchableOpacity style={styles.planItem}>
              <Text style={styles.planTitle}>{item.titleEn} / {item.titleBn}</Text>
              {item.ageGroup && <Text style={styles.ageGroup}>{item.ageGroup.replace('_', ' ')}</Text>}
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text>No child nutrition plans available.</Text>}
      />
    </View>
  );
}

const getStyles = (colors: any) => {
  const commonStyles = getCommonStyles(colors);
  return StyleSheet.create({
    ...commonStyles,
    searchInput: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
      backgroundColor: colors.card,
      color: colors.text,
    },
    planItem: {
      ...commonStyles.card,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    planTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
    ageGroup: { fontSize: 14, color: colors.subtext, marginTop: 4, textTransform: 'capitalize' }
  });
};