import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Meal } from 'shared';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface MealCardProps {
  meal: Meal;
  isCompleted: boolean;
  onToggleCompletion: (mealId: string) => void;
}

export const MealCard = ({ meal, isCompleted, onToggleCompletion }: MealCardProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.mealType}>{meal.mealType}</Text>
        <TouchableOpacity onPress={() => onToggleCompletion(meal.id)}>
          <FontAwesome
            name={isCompleted ? 'check-square-o' : 'square-o'}
            size={24}
            color={isCompleted ? '#28a745' : '#6c757d'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{meal.descriptionEn}</Text>
      <Text style={styles.descriptionBn}>{meal.descriptionBn}</Text>
      {meal.calories != null && <Text style={styles.calories}>Approx. {meal.calories} kcal</Text>}
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
  },
  mealType: {
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'capitalize',
      color: colors.text,
  },
  description: {
      fontSize: 14,
      color: colors.subtext,
  },
  descriptionBn: {
      fontSize: 14,
      color: colors.subtext,
      fontStyle: 'italic',
      marginTop: 4,
  },
  calories: {
      marginTop: 8,
      fontSize: 12,
      color: '#28a745',
      fontWeight: '500',
  },
});