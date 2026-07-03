import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Profile</Text>
      <Text>
        This screen will contain a form for the user to update their health profile
        (condition, age group, etc.) which will call the PATCH /api/v1/users/me/health-profile endpoint.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
});