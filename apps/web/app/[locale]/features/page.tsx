import Link from 'next/link';
import { Apple, Bell, Users, HeartPulse, Languages, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Apple,
    title: 'Personalized diet plans',
    body: "Plans tailored to diabetes, cardiac care, general wellness, or child nutrition — not a one-size-fits-all calorie chart.",
  },
  {
    icon: Users,
    title: 'Family wellness hub',
    body: 'One account covers every family member, each with their own health profile and age-appropriate targets.',
  },
  {
    icon: Bell,
    title: 'Smart reminders',
    body: "Meal and medication reminders scheduled around your family's actual routine, not a fixed daily alarm.",
  },
  {
    icon: HeartPulse,
    title: 'Health-condition aware',
    body: 'Meal plans built with real dietary conditions in mind: diabetes-friendly, heart-healthy, and child-safe options.',
  },
  {
    icon: Languages,
    title: 'Bilingual by design',
    body: 'Built for English and Bengali-speaking households from the ground up, not translated as an afterthought.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    body: "Your family's health data is never sold or shared. You control what's tracked and who can see it.",
  },
];

export default function FeaturesPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold text-nevo-ink md:text-5xl">
            Built for how families actually eat
          </h1>
          <p className="mt-4 text-lg text-nevo-ink-dim">
            Every feature exists to remove one piece of daily guesswork — nothing added just to
            pad a features page.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-nevo-line bg-nevo-panel-2 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nevo-accent/10">
                <Icon className="h-5 w-5 text-nevo-accent" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-nevo-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-nevo-ink-dim">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-nevo-line bg-nevo-panel px-8 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold text-nevo-ink">
            See it with your own family in mind
          </h2>
          <p className="mx-auto mt-3 max-w-md text-nevo-ink-dim">
            Create a free account and build your first meal plan in minutes.
          </p>
          <Link
            href={`/${locale}/register`}
            className="mt-7 inline-block rounded-lg bg-nevo-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-nevo-accent-dim"
          >
            Get started free
          </Link>
        </div>
      </div>
    </section>
  );
}
