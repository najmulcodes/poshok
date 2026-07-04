'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Heart, Loader2, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import apiFetch from '@/lib/api';

type DietPlan = {
  id: string;
  condition: 'DIABETES' | 'CARDIAC' | 'GENERAL' | 'CHILD';
  ageGroup: 'TWO_TO_FIVE' | 'SIX_TO_TEN' | null;
  titleEn: string;
  titleBn: string;
  version: number;
};

const CONDITION_LABEL: Record<DietPlan['condition'], string> = {
  DIABETES: 'Diabetes-friendly',
  CARDIAC: 'Heart-healthy',
  GENERAL: 'General wellness',
  CHILD: 'Child nutrition',
};

const AGE_GROUP_LABEL: Record<string, string> = {
  TWO_TO_FIVE: 'Ages 2–5',
  SIX_TO_TEN: 'Ages 6–10',
};

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { user, token, loading: authLoading } = useAuth();

  const [plans, setPlans] = useState<DietPlan[] | null>(null);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, 'subscribe' | 'favorite' | null>>({});
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});
  const [favorited, setFavorited] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/${locale}/login`);
    }
  }, [authLoading, user, locale, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    apiFetch('/diet-plans')
      .then((data: DietPlan[]) => {
        if (!cancelled) setPlans(data);
      })
      .catch((err) => {
        if (!cancelled) setPlansError(err instanceof Error ? err.message : 'Could not load diet plans.');
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!token) return;
    setActionError(null);
    setPending((p) => ({ ...p, [planId]: 'subscribe' }));
    try {
      await apiFetch(`/diet-plans/${planId}/subscribe`, { method: 'POST', token });
      setSubscribed((s) => ({ ...s, [planId]: true }));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not subscribe to this plan.');
    } finally {
      setPending((p) => ({ ...p, [planId]: null }));
    }
  };

  const handleFavorite = async (planId: string) => {
    if (!token) return;
    setActionError(null);
    setPending((p) => ({ ...p, [planId]: 'favorite' }));
    try {
      const res = await apiFetch(`/diet-plans/${planId}/favorite`, { method: 'POST', token });
      setFavorited((f) => ({ ...f, [planId]: res.favorited }));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not update favorites.');
    } finally {
      setPending((p) => ({ ...p, [planId]: null }));
    }
  };

  if (authLoading || !user) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-nevo-bg">
        <Loader2 className="h-6 w-6 animate-spin text-nevo-ink-mute" />
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-nevo-bg px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-nevo-ink">
            Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="mt-2 text-nevo-ink-dim">
            Browse published meal plans and subscribe to the ones that fit your family.
          </p>
        </div>

        {actionError && (
          <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </p>
        )}

        <div className="mt-8">
          {plansError && (
            <p className="rounded-lg border border-nevo-line bg-nevo-panel px-4 py-3 text-sm text-nevo-ink-dim">
              {plansError} This usually means the API isn&apos;t reachable yet from this deployment.
            </p>
          )}

          {!plansError && plans === null && (
            <div className="flex items-center gap-2 text-sm text-nevo-ink-dim">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading plans…
            </div>
          )}

          {plans !== null && plans.length === 0 && (
            <div className="rounded-xl border border-nevo-line bg-nevo-panel px-6 py-10 text-center">
              <UtensilsCrossed className="mx-auto h-8 w-8 text-nevo-ink-mute" strokeWidth={1.5} />
              <p className="mt-3 text-nevo-ink-dim">No published meal plans yet. Check back soon.</p>
            </div>
          )}

          {plans && plans.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col rounded-xl border border-nevo-line bg-nevo-panel-2 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-full bg-nevo-accent/10 px-2.5 py-1 text-xs font-medium text-nevo-accent">
                        {CONDITION_LABEL[plan.condition]}
                      </span>
                      <h3 className="mt-3 font-semibold text-nevo-ink">{plan.titleEn}</h3>
                      <p className="mt-1 text-xs text-nevo-ink-mute">
                        {plan.ageGroup ? AGE_GROUP_LABEL[plan.ageGroup] : 'All ages'} · v{plan.version}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFavorite(plan.id)}
                      disabled={pending[plan.id] === 'favorite'}
                      aria-label="Toggle favorite"
                      className="shrink-0 text-nevo-ink-mute transition-colors hover:text-nevo-accent disabled:opacity-50"
                    >
                      <Heart
                        className="h-5 w-5"
                        strokeWidth={1.75}
                        fill={favorited[plan.id] ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribed[plan.id] || pending[plan.id] === 'subscribe'}
                    className="mt-5 rounded-lg bg-nevo-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-nevo-accent-dim disabled:cursor-not-allowed disabled:bg-nevo-line disabled:text-nevo-ink-dim"
                  >
                    {subscribed[plan.id]
                      ? 'Subscribed'
                      : pending[plan.id] === 'subscribe'
                      ? 'Subscribing…'
                      : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
