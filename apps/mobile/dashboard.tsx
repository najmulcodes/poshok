import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/auth/useAuth';
import { useTranslation } from '@/lib/i18n';

export default function DashboardScreen() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  const activeSubscription = user?.subscriptions?.[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.email}</Text>
      {activeSubscription ? (
        <View>
          <Text style={styles.planTitle}>Current Plan: {activeSubscription.dietPlan.titleEn}</Text>
          {/* Here you would map over activeSubscription.dietPlan.meals */}
        </View>
      ) : (
        <Text>{t('Mobile.noPlan')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  planTitle: { fontSize: 18, fontWeight: '600' },
});