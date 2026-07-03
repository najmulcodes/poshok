import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import apiFetch from '@/lib/api';
import { useAuth } from '@/lib/auth/useAuth';
import { useTranslation } from '@/lib/i18n';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { getCommonStyles } from '@/constants/styles';

interface Meal {
  id: string;
  mealType: string;
  descriptionEn: string;
  descriptionBn: string;
  calories?: number;
  order: number;
}

interface DietPlanDetails {
  id: string;
  titleEn: string;
  titleBn: string;
  isFavorited: boolean;
  meals: Meal[];
}

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { refetchUser } = useAuth();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [plan, setPlan] = useState<DietPlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPlanDetails = async () => {
      try {
        const data = await apiFetch(`/diet-plans/${id}`);
        setPlan(data);
        setIsFavorited(data.isFavorited);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load plan details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;

    // Optimistic update
    const originalIsFavorited = isFavorited;
    setIsFavorited(!originalIsFavorited);

    try {
      await apiFetch(`/diet-plans/${id}/favorite`, { method: 'POST' });
    } catch (error) {
      // Revert on error
      setIsFavorited(originalIsFavorited);
      Alert.alert('Error', t('Mobile.toggleFavoriteError'));
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleToggleFavorite} style={{ marginRight: 15 }}>
          <FontAwesome name={isFavorited ? 'star' : 'star-o'} size={24} color="#FFD700" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorited, handleToggleFavorite]);

  const handleSubscribe = async () => {
    if (!id) return;
    setIsSubscribing(true);
    try {
      await apiFetch(`/diet-plans/${id}/subscribe`, { method: 'POST' });
      Alert.alert(
        t('Mobile.subscribeSuccessTitle'),
        t('Mobile.subscribeSuccessMessage'),
        [
          {
            text: 'OK',
            onPress: async () => {
              await refetchUser();
              router.replace('/(tabs)/dashboard');
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(t('Mobile.subscribeErrorTitle'), t('Mobile.subscribeErrorMessage'));
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (!plan) {
    return (
      <View style={styles.centered}>
        <Text>Plan not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>{plan.titleEn}</Text>
      <Text style={styles.subtitle}>{plan.titleBn}</Text>

      <View style={styles.mealsContainer}>
        {plan.meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <Text style={styles.mealType}>{meal.mealType}</Text>
            <Text>{meal.descriptionEn}</Text>
            <Text style={styles.mealDescriptionBn}>{meal.descriptionBn}</Text>
            {meal.calories && <Text style={styles.calories}>Approx. {meal.calories} kcal</Text>}
          </View>
        ))}
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title={isSubscribing ? 'Subscribing...' : t('Mobile.subscribeButton')}
          onPress={handleSubscribe}
          disabled={isSubscribing}
        />
      </View>
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Disclaimer: Nevo provides nutritional suggestions and is not a substitute for professional medical advice. Always consult with a doctor or registered dietitian.
        </Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: any) => {
  const commonStyles = getCommonStyles(colors);
  return StyleSheet.create({
    ...commonStyles,
    title: { ...commonStyles.title, textAlign: 'center', paddingHorizontal: 16, paddingTop: 16, marginBottom: 0 },
    subtitle: { fontSize: 18, textAlign: 'center', color: colors.subtext, paddingBottom: 16 },
    mealsContainer: { paddingHorizontal: 16 },
    mealCard: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mealType: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize', marginBottom: 8, color: colors.text },
    mealDescriptionBn: { color: colors.subtext, fontStyle: 'italic', marginTop: 4 },
    calories: { marginTop: 8, color: '#28a745', fontWeight: '500' },
    buttonWrapper: { margin: 16 },
    disclaimerContainer: { padding: 16, alignItems: 'center' },
    disclaimerText: { fontSize: 12, color: colors.subtext, textAlign: 'center' },
  });
};