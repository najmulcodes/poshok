import Link from 'next/link';
import { Apple, Bell, ChevronDown, Users } from 'lucide-react';

const features = [
  {
    icon: Apple,
    title: 'Personalized diet plans',
    body: "Meal plans built around each person's health conditions, dietary needs, and taste — not a generic calorie chart.",
  },
  {
    icon: Users,
    title: 'Family wellness hub',
    body: "One account, every member. Track nutrition for parents, grandparents, and kids with age-appropriate targets.",
  },
  {
    icon: Bell,
    title: 'Smart reminders',
    body: "Meal and medication reminders that adapt to your family's real schedule, not a fixed alarm clock.",
  },
];

const stats = [
  { value: '10K+', label: 'Active families' },
  { value: '50K+', label: 'Meal plans served' },
  { value: '4.9', label: 'Average rating' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-nevo-bg pt-36 pb-24 md:pt-44 md:pb-28">
        {/* one restrained glow, not a pair of competing blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-nevo-gold/[0.08] blur-[120px]"
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-nevo-line bg-nevo-panel px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-nevo-gold" />
            <span className="text-xs font-medium uppercase tracking-wider text-nevo-ink-dim">
              Nevo Platform
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.08] text-nevo-ink md:text-6xl">
            Family nutrition,
            <br />
            <span className="italic text-nevo-gold">made simple.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-nevo-ink-dim">
            Personalized meal plans, health tracking, and smart reminders —
            everything your family needs to eat well, in one place.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/en/register"
              className="w-full rounded-lg bg-nevo-gold px-7 py-3.5 text-center font-semibold text-nevo-bg transition-colors hover:bg-nevo-gold-dim sm:w-auto"
            >
              Start free trial
            </Link>
            <Link
              href="/en/demo"
              className="w-full rounded-lg border border-nevo-line px-7 py-3.5 text-center font-medium text-nevo-ink transition-colors hover:border-nevo-ink-mute sm:w-auto"
            >
              Watch demo
            </Link>
          </div>
        </div>

        {/* Stats, presented as a single divided plate rather than three
            loose, disconnected blocks — the divider is the signature and
            it means something: a plate split into portions. */}
        <div className="relative z-10 mx-auto mt-16 flex max-w-xl divide-x divide-nevo-line rounded-2xl border border-nevo-line bg-nevo-panel/60">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 px-4 py-5 text-center">
              <div className="font-display text-2xl font-medium text-nevo-ink md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-nevo-ink-mute">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-14 flex justify-center">
          <ChevronDown className="h-5 w-5 animate-bounce text-nevo-ink-mute" />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-nevo-line bg-nevo-panel py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="font-display text-3xl font-medium text-nevo-ink md:text-4xl">
              Everything you need
            </h2>
            <p className="mt-3 text-nevo-ink-dim">
              A few things done well, instead of a feature list nobody uses.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-nevo-line bg-nevo-panel-2 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nevo-gold/10">
                  <Icon className="h-5 w-5 text-nevo-gold" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-nevo-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nevo-ink-dim">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-nevo-line bg-nevo-bg py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-nevo-line bg-nevo-panel px-8 py-12 text-center">
          <h2 className="font-display text-2xl font-medium text-nevo-ink md:text-3xl">
            Ready to feed your family well?
          </h2>
          <p className="mt-3 text-nevo-ink-dim">
            Join families already using Nevo to plan meals with less guesswork.
          </p>
          <Link
            href="/en/register"
            className="mt-7 inline-block rounded-lg bg-nevo-gold px-8 py-3.5 font-semibold text-nevo-bg transition-colors hover:bg-nevo-gold-dim"
          >
            Get started free
          </Link>
        </div>
      </section>
    </>
  );
}
