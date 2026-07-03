import { useEffect } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/lib/auth/useAuth';
import { useTranslation } from '@/lib/i18n';
import { FontAwesome } from '@expo/vector-icons';
import { registerForPushNotificationsAsync, savePushToken } from '@/lib/notifications/push';

export default function TabLayout() {
  const { token, loading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      // Register for push notifications after user is logged in
      registerForPushNotificationsAsync().then(pushToken => {
        if (pushToken) {
          savePushToken(pushToken);
        }
      });
    }
  }, [token]);

  if (!loading && !token) {
    // User is not signed in, redirect to the login screen.
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{
      // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{ title: t('Mobile.dashboard'), tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t('Mobile.profile'), tabBarIcon: ({ color }) => <FontAwesome name="user" size={28} color={color} /> }}
      />
      <Tabs.Screen
        name="child-nutrition"
        options={{ title: t('Mobile.childNutrition'), tabBarIcon: ({ color }) => <FontAwesome name="child" size={28} color={color} /> }}
      />
    </Tabs>
  );
}