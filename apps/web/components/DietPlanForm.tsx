'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDietPlanRefinedSchema } from 'shared';
import type { Condition, AgeGroup, MealType } from 'shared';
import { z } from 'zod';

// Define enum values for UI
const CONDITIONS = ['DIABETES', 'CARDIAC', 'GENERAL', 'CHILD'] as const;
const AGE_GROUPS = ['TWO_TO_FIVE', 'SIX_TO_TEN'] as const;
const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import apiFetch from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DietPlanFormProps = {
  plan?: any; // API response type
};

const formSchema = createDietPlanRefinedSchema;
type FormValues = z.infer<typeof formSchema>;

export function DietPlanForm({ plan }: DietPlanFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: plan ? {
      ...plan,
      ageGroup: plan.ageGroup || null,
    } : {
      titleEn: '',
      titleBn: '',
      condition: 'GENERAL' as Condition,
      ageGroup: null,
      meals: [{ mealType: 'BREAKFAST' as MealType, order: 1, descriptionEn: '', descriptionBn: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'meals',
  });

  const watchedCondition = watch('condition');

  const onSubmit = async (data: FormValues) => {
    if (!token) return;
    try {
      const payload = { ...data, ageGroup: data.ageGroup === null ? undefined : data.ageGroup };
      if (plan) {
        await apiFetch(`/admin/diet-plans/${plan.id}`, { method: 'PATCH', token, body: JSON.stringify(payload) });
      } else {
        await apiFetch('/admin/diet-plans', { method: 'POST', token, body: JSON.stringify(payload) });
      }
      router.push('/admin/diet-plans');
      router.refresh();
    } catch (error) {
      console.error('Failed to save plan', error);
      alert('Failed to save plan.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="titleEn">English Title</Label>
          <Input id="titleEn" {...register('titleEn')} />
          {errors.titleEn && <p className="text-red-500 text-sm">{errors.titleEn.message}</p>}
        </div>
        <div>
          <Label htmlFor="titleBn">Bangla Title</Label>
          <Input id="titleBn" {...register('titleBn')} />
          {errors.titleBn && <p className="text-red-500 text-sm">{errors.titleBn.message}</p>}
        </div>
        <Controller control={control} name="condition" render={({ field }) => (
          <div><Label>Condition</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>{errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}</div>
        )} />
        {watchedCondition === 'CHILD' && (
          <Controller control={control} name="ageGroup" render={({ field }) => (
            <div><Label>Age Group</Label><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger><SelectContent>{AGE_GROUPS.map(ag => <SelectItem key={ag} value={ag}>{ag}</SelectItem>)}</SelectContent></Select>{errors.ageGroup && <p className="text-red-500 text-sm">{errors.ageGroup.message}</p>}</div>
          )} />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Meals</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => remove(index)}>Remove</Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller control={control} name={`meals.${index}.mealType`} render={({ field }) => (
                <div><Label>Meal Type</Label><Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MEAL_TYPES.map(mt => <SelectItem key={mt} value={mt}>{mt}</SelectItem>)}</SelectContent></Select></div>
              )} />
              <div>
                <Label>Order</Label>
                <Input type="number" {...register(`meals.${index}.order`, { valueAsNumber: true })} />
              </div>
            </div>
            <div>
              <Label>English Description</Label>
              <Textarea {...register(`meals.${index}.descriptionEn`)} />
            </div>
            <div>
              <Label>Bangla Description</Label>
              <Textarea {...register(`meals.${index}.descriptionBn`)} />
            </div>
            <div>
              <Label>Calories (optional)</Label>
              <Input type="number" {...register(`meals.${index}.calories`, { valueAsNumber: true, setValueAs: v => v ? parseInt(String(v), 10) : undefined })} />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ mealType: MealType.SNACK, order: fields.length + 1, descriptionEn: '', descriptionBn: '' })}>Add Meal</Button>
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Plan'}</Button>
    </form>
  );
}