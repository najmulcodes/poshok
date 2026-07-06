import { StyleSheet } from 'react-native';

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  border: string;
  [key: string]: string;
};

/**
 * Shared style building blocks used across multiple screens so spacing and
 * card treatment stay consistent. Screen-specific styles should spread this
 * in and extend it, not replace it.
 */
export const getCommonStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
