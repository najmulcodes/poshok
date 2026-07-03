import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/constants/i18n';
import { useRouter } from 'expo-router';
import { MealCard } from '@/components/diet/MealCard';
import apiFetch from '@/services/api';

export default function DashboardScreen() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user?.mealCompletions) {
      setCompletedMeals(new Set(user.mealCompletions.map(c => c.mealId)));
    }
  }, [user]);

  const handleToggleCompletion = async (mealId: string) => {
    const newCompletedMeals = new Set(completedMeals);
    const isCurrentlyCompleted = newCompletedMeals.has(mealId);

    // Optimistic UI update
    isCurrentlyCompleted ? newCompletedMeals.delete(mealId) : newCompletedMeals.add(mealId);
    setCompletedMeals(newCompletedMeals);

    try {
      await apiFetch('/users/me/completions', { method: 'POST', body: JSON.stringify({ mealId }) });
    } catch (error) {
      Alert.alert('Error', t('Mobile.updateStatusError'));
      // Revert UI on error
      setCompletedMeals(new Set(completedMeals));
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  const activeSubscription = user?.subscriptions?.[0];
  const plan = activeSubscription?.dietPlan;

  const NoPlanView = () => (
    <View style={styles.centered}>
      <Text style={styles.noPlanText}>{t('Mobile.noPlan')}</Text>
      <Text style={styles.noPlanSubText}>{t('Mobile.viewOtherPlans')}</Text>
      <Button title={t('Mobile.childNutrition')} onPress={() => router.push('/(tabs)/child-nutrition')} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={!plan ? styles.centeredContent : {}}>
      <Text style={styles.title}>Welcome, {user?.email}</Text>
      {plan ? (
        <View>
          <Text style={styles.planTitle}>{t('Mobile.yourCurrentPlan')}</Text>
          <View style={styles.planCard}>
            <Text style={styles.planName}>{plan.titleEn}</Text>
            <Text style={styles.planNameBn}>{plan.titleBn}</Text>
          </View>

          <Text style={styles.mealsHeader}>{t('Mobile.todaysMeals')}</Text>
          {plan.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              isCompleted={completedMeals.has(meal.id)}
              onToggleCompletion={handleToggleCompletion}
            />
          ))}
        </View>
      ) : (
        <NoPlanView />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  centeredContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#343a40' },
  planTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#495057' },
  planCard: {
    backgroundColor: '#e9ecef',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  planNameBn: {
    fontSize: 18,
    textAlign: 'center',
    color: '#495057',
    marginTop: 4,
  },
  mealsHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#495057',
  },
  noPlanText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 8,
  },
  noPlanSubText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
});