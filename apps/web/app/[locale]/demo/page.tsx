import Link from 'next/link';
import { UserPlus, HeartPulse, CalendarCheck, Bell } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Add your family',
    body: 'Create profiles for each person — parents, kids, grandparents — in under a minute.',
  },
  {
    icon: HeartPulse,
    title: 'Set health context',
    body: 'Flag conditions like diabetes or cardiac care so plans are built around real needs.',
  },
  {
    icon: CalendarCheck,
    title: 'Subscribe to a plan',
    body: 'Browse published meal plans and subscribe to the ones that fit your household.',
  },
  {
    icon: Bell,
    title: 'Get reminded',
    body: "Meal and medication reminders land at the right time, based on your family's routine.",
  },
];

export default function DemoPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-semibold text-nevo-ink md:text-5xl">
          What using Nevo looks like
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-nevo-ink-dim">
          We don&apos;t have a recorded walkthrough up yet — here&apos;s what happens in the four
          minutes it takes to get set up.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-xl border border-nevo-line bg-nevo-panel-2 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-nevo-accent/10">
                <step.icon className="h-5 w-5 text-nevo-accent" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-nevo-ink-mute">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-semibold text-nevo-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-nevo-ink-dim">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-nevo-line bg-nevo-panel px-8 py-10 text-center">
          <h2 className="font-display text-xl font-semibold text-nevo-ink">
            Prefer a live walkthrough instead?
          </h2>
          <p className="mt-2 text-nevo-ink-dim">
            Reach out and we&apos;ll show you around in person.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}/register`}
              className="w-full rounded-lg bg-nevo-accent px-7 py-3 text-center font-semibold text-white transition-colors hover:bg-nevo-accent-dim sm:w-auto"
            >
              Try it yourself, free
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="w-full rounded-lg border border-nevo-line px-7 py-3 text-center font-medium text-nevo-ink transition-colors hover:border-nevo-ink-mute sm:w-auto"
            >
              Book a walkthrough
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
