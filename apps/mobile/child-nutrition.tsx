import { View, Text, StyleSheet } from 'react-native';

export default function ChildNutritionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Child Nutrition Plans</Text>
      <Text>
        This screen will fetch and display a list of diet plans where the condition is 'CHILD'.
        Users can view and subscribe to these plans.
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