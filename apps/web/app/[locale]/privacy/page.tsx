export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-nevo-ink">Privacy policy</h1>
        <p className="mt-3 text-sm text-nevo-ink-mute">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-nevo-ink-dim">
          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">What we collect</h2>
            <p className="mt-2 leading-relaxed">
              When you create an account, we collect your email address and password. If you build
              out a health profile for yourself or a family member, we collect the health
              information you choose to enter — conditions, age group, and meal preferences —
              in order to generate relevant diet plans and reminders.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">How we use it</h2>
            <p className="mt-2 leading-relaxed">
              Your data is used only to run the product: matching you with relevant diet plans,
              scheduling meal and medication reminders, and maintaining your account. We do not
              sell your data or share it with advertisers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">Your control</h2>
            <p className="mt-2 leading-relaxed">
              You can update or remove your health profile information at any time from your
              account. To request full account deletion, contact us and we&apos;ll process it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">Contact</h2>
            <p className="mt-2 leading-relaxed">
              Questions about this policy can be sent through our{' '}
              <a href={`/${locale}/contact`} className="text-nevo-accent hover:text-nevo-accent-dim">
                contact page
              </a>
              .
            </p>
          </div>

          <p className="rounded-lg border border-nevo-line bg-nevo-panel px-4 py-3 text-xs text-nevo-ink-mute">
            This is a starting template, not legal advice. Since Nevo handles health information,
            we&apos;d recommend having this reviewed by a lawyer familiar with health-data
            regulations in your market before launch.
          </p>
        </div>
      </div>
    </section>
  );
}
