import { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from 'expo-router';
import apiFetch from '@/services/api';
import { healthProfileSchema, ConditionEnum, AgeGroupEnum, LanguageEnum } from 'shared';
import { z } from 'zod';

const profileFormSchema = healthProfileSchema.extend({
  breakfastTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional().nullable(),
  lunchTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional().nullable(),
  dinnerTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional().nullable(),
  snackTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional().nullable(),
});

type FormValues = z.infer<typeof profileFormSchema>;

export default function ProfileScreen() {
  const { user, loading, refetchUser } = useAuth();
  const { colors, themePreference, setThemePreference } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const styles = getStyles(colors);

  const { control, handleSubmit, watch, reset, formState: { isSubmitting, errors } } = useForm<FormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      condition: user?.healthProfile?.condition || 'GENERAL',
      ageGroup: user?.healthProfile?.ageGroup || null,
      language: user?.healthProfile?.language || 'BN',
    },
  });

  // Reset form with user data when it loads
  useEffect(() => {
    if (user?.healthProfile) {
      const profile = {
        ...user.healthProfile,
        // Reformat time from "HH:mm:ss" to "HH:mm" for the input
        breakfastTime: user.healthProfile.breakfastTime?.substring(0, 5),
        lunchTime: user.healthProfile.lunchTime?.substring(0, 5),
        dinnerTime: user.healthProfile.dinnerTime?.substring(0, 5),
        snackTime: user.healthProfile.snackTime?.substring(0, 5),
      };
      reset(profile);
    }
  }, [user, reset]);

  const watchedCondition = watch('condition');

  const onSubmit = async (data: FormValues) => {
    try {
      // Format time back to "HH:mm:ss" for the database
      const payload = {
        ...data,
        breakfastTime: data.breakfastTime ? `${data.breakfastTime}:00` : null,
        lunchTime: data.lunchTime ? `${data.lunchTime}:00` : null,
        dinnerTime: data.dinnerTime ? `${data.dinnerTime}:00` : null,
        snackTime: data.snackTime ? `${data.snackTime}:00` : null,
      };
      await apiFetch('/users/me/health-profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      Alert.alert('Success', t('Mobile.saveSuccess'));
      await refetchUser();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', t('Mobile.saveError'));
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>{t('Mobile.healthProfileTitle')}</Text>

      <Text style={styles.label}>{t('Mobile.conditionLabel')}</Text>
      <Controller
        control={control}
        name="condition"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{ color: colors.text }}
            >
              {ConditionEnum.options.map((c) => <Picker.Item key={c} label={c} value={c} />)}
            </Picker>
          </View>
        )}
      />

      {watchedCondition === 'CHILD' && (
        <>
          <Text style={styles.label}>{t('Mobile.ageGroupLabel')}</Text>
          <Controller
            control={control}
            name="ageGroup"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={{ color: colors.text }}
                >
                  {AgeGroupEnum.options.map((ag) => <Picker.Item key={ag} label={ag} value={ag} />)}
                </Picker>
              </View>
            )}
          />
          {errors.ageGroup && <Text style={styles.errorText}>{errors.ageGroup.message}</Text>}
        </>
      )}

      <Text style={styles.label}>{t('Mobile.languageLabel')}</Text>
      <Controller
        control={control}
        name="language"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{ color: colors.text }}
            >
              {LanguageEnum.options.map((lang) => <Picker.Item key={lang} label={lang} value={lang} />)}
            </Picker>
          </View>
        )}
      />

      <Text style={styles.title}>Notification Times</Text>
      <Text style={styles.label}>Breakfast (HH:mm)</Text>
      <Controller control={control} name="breakfastTime" render={({ field: { onChange, value } }) => <TextInput style={styles.input} placeholder="e.g., 08:00" value={value || ''} onChangeText={onChange} />} />
      {errors.breakfastTime && <Text style={styles.errorText}>{errors.breakfastTime.message}</Text>}

      <Text style={styles.label}>Lunch (HH:mm)</Text>
      <Controller control={control} name="lunchTime" render={({ field: { onChange, value } }) => <TextInput style={styles.input} placeholder="e.g., 13:00" value={value || ''} onChangeText={onChange} />} />
      {errors.lunchTime && <Text style={styles.errorText}>{errors.lunchTime.message}</Text>}

      <Text style={styles.label}>Dinner (HH:mm)</Text>
      <Controller control={control} name="dinnerTime" render={({ field: { onChange, value } }) => <TextInput style={styles.input} placeholder="e.g., 20:00" value={value || ''} onChangeText={onChange} />} />
      {errors.dinnerTime && <Text style={styles.errorText}>{errors.dinnerTime.message}</Text>}

      <Text style={styles.label}>Snack (HH:mm)</Text>
      <Controller control={control} name="snackTime" render={({ field: { onChange, value } }) => <TextInput style={styles.input} placeholder="e.g., 16:00" value={value || ''} onChangeText={onChange} />} />
      {errors.snackTime && <Text style={styles.errorText}>{errors.snackTime.message}</Text>}

      <View style={styles.buttonWrapper}>
        <Button title={isSubmitting ? 'Saving...' : t('Mobile.saveButton')} onPress={handleSubmit(onSubmit)} disabled={isSubmitting || loading} />
      </View>

      <TouchableOpacity style={styles.favoritesButton} onPress={() => router.push('/favorites/')}>
        <Text style={styles.favoritesButtonText}>{t('Mobile.myFavorites')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Theme</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={themePreference}
          onValueChange={(itemValue) => setThemePreference(itemValue)}
          style={{ color: colors.text }}
        >
          <Picker.Item label="System" value="system" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
        </Picker>
      </View>

      <View style={{ height: 50 }} />

    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: colors.text },
    label: { fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 8 },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: colors.card,
    },
    input: {
      height: 40,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
      color: colors.text,
      backgroundColor: colors.card,
    },
    buttonWrapper: {
      marginTop: 20,
    },
    errorText: {
      color: 'red',
      marginTop: -15,
      marginBottom: 10,
    },
    favoritesButton: {
      marginTop: 30,
      paddingVertical: 15,
      backgroundColor: '#6c757d',
      borderRadius: 8,
    },
    favoritesButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });