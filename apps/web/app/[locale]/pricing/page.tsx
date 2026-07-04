import Link from 'next/link';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything a single family needs to get started.',
    features: [
      'Up to 3 family members',
      'Personalized diet plans',
      'Meal & medication reminders',
      'English + Bengali support',
    ],
    cta: 'Get started free',
    href: 'register',
  },
  {
    name: 'Family',
    price: '$6',
    period: '/month',
    description: 'For larger households who want more depth.',
    features: [
      'Unlimited family members',
      'Health condition tracking',
      'Priority reminder scheduling',
      'Favorite & save unlimited plans',
    ],
    cta: 'Talk to us',
    href: 'contact',
    highlighted: true,
  },
  {
    name: 'Care Partner',
    price: 'Custom',
    period: '',
    description: 'For clinics and community health programs.',
    features: [
      'Bulk family onboarding',
      'Dedicated support',
      'Custom diet plan authoring',
      'Usage reporting',
    ],
    cta: 'Contact sales',
    href: 'contact',
  },
];

export default function PricingPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold text-nevo-ink md:text-5xl">
            Simple pricing, built to grow with your family
          </h1>
          <p className="mt-4 text-lg text-nevo-ink-dim">
            Start free. Upgrade only when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-7 ${
                tier.highlighted
                  ? 'border-nevo-accent bg-nevo-panel-2 ring-1 ring-nevo-accent/30'
                  : 'border-nevo-line bg-nevo-panel-2'
              }`}
            >
              {tier.highlighted && (
                <span className="mb-3 inline-block w-fit rounded-full bg-nevo-accent/10 px-2.5 py-1 text-xs font-medium text-nevo-accent">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-nevo-ink">{tier.name}</h3>
              <p className="mt-1 text-sm text-nevo-ink-dim">{tier.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-nevo-ink">{tier.price}</span>
                {tier.period && <span className="text-sm text-nevo-ink-mute">{tier.period}</span>}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-nevo-ink-dim">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-nevo-accent" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/${tier.href}`}
                className={`mt-7 rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? 'bg-nevo-accent text-white hover:bg-nevo-accent-dim'
                    : 'border border-nevo-line text-nevo-ink hover:border-nevo-ink-mute'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-nevo-ink-mute">
          Family and Care Partner plans are onboarded manually for now — reach out and we&apos;ll
          set you up.
        </p>
      </div>
    </section>
  );
}
