import Link from 'next/link';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-nevo-ink md:text-5xl">
          Why we built Nevo
        </h1>

        <div className="mt-8 space-y-5 text-nevo-ink-dim">
          <p>
            Planning meals for a whole family is harder than it should be, especially when
            different people in the same house need different things — a grandparent managing
            diabetes, a toddler who needs age-appropriate portions, someone recovering from heart
            surgery.
          </p>
          <p>
            Nevo exists to make that easier: one place to plan meals, track health conditions, and
            get reminders that actually fit your family&apos;s schedule — in English or Bengali,
            whichever your household speaks.
          </p>
          <p>
            We&apos;re early. The product you&apos;re using today is a focused first version, built
            deliberately small so every feature earns its place, with much more on the way.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-nevo-line bg-nevo-panel px-8 py-10 text-center">
          <h2 className="font-display text-xl font-semibold text-nevo-ink">
            Have questions, or want to help shape what we build next?
          </h2>
          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-block rounded-lg bg-nevo-accent px-7 py-3 font-semibold text-white transition-colors hover:bg-nevo-accent-dim"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
