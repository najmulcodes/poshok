import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export interface Meal {
  id: string;
  mealType: string;
  descriptionEn: string;
  descriptionBn: string;
  calories?: number;
  order: number;
}

interface MealCardProps {
  meal: Meal;
  isCompleted: boolean;
  onToggleCompletion: (mealId: string) => void;
}

export function MealCard({ meal, isCompleted, onToggleCompletion }: MealCardProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={() => onToggleCompletion(meal.id)}
      activeOpacity={0.7}
    >
      <View style={styles.checkbox}>
        <FontAwesome
          name={isCompleted ? 'check-circle' : 'circle-o'}
          size={22}
          color={isCompleted ? colors.primary : colors.subtext}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.mealType}>{meal.mealType}</Text>
        <Text style={[styles.description, isCompleted && styles.textCompleted]}>
          {meal.descriptionEn}
        </Text>
        <Text style={[styles.descriptionBn, isCompleted && styles.textCompleted]}>
          {meal.descriptionBn}
        </Text>
        {meal.calories != null && <Text style={styles.calories}>Approx. {meal.calories} kcal</Text>}
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 10,
      alignItems: 'flex-start',
    },
    cardCompleted: {
      opacity: 0.6,
    },
    checkbox: {
      marginRight: 12,
      marginTop: 2,
    },
    content: {
      flex: 1,
    },
    mealType: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: colors.subtext,
      marginBottom: 2,
    },
    description: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    descriptionBn: {
      fontSize: 14,
      color: colors.subtext,
      marginTop: 2,
    },
    textCompleted: {
      textDecorationLine: 'line-through',
    },
    calories: {
      marginTop: 6,
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
  });
