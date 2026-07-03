'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import apiFetch from '@/lib/api';
import { DietPlanForm } from '@/components/DietPlanForm';

export default function EditDietPlanPage() {
  const { token } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;

    const fetchPlan = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/admin/diet-plans/${id}`, { token });
        setPlan(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch diet plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [token, id]);

  if (loading) return <div>Loading plan data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!plan) return <div>Plan not found.</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Diet Plan</h1>
      <DietPlanForm plan={plan} />
    </div>
  );
}