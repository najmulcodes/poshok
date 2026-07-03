import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Meal } from 'shared';
import { FontAwesome } from '@expo/vector-icons';

interface MealCardProps {
  meal: Meal;
  isCompleted: boolean;
  onToggleCompletion: (mealId: string) => void;
}

export const MealCard = ({ meal, isCompleted, onToggleCompletion }: MealCardProps) => {
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

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
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
        color: '#343a40',
    },
    description: {
        fontSize: 14,
        color: '#495057',
    },
    descriptionBn: {
        fontSize: 14,
        color: '#495057',
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