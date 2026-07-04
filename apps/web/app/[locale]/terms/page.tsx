export default function TermsPage() {
  return (
    <section className="bg-nevo-bg px-6 pb-24 pt-32 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-nevo-ink">Terms of service</h1>
        <p className="mt-3 text-sm text-nevo-ink-mute">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-nevo-ink-dim">
          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">Using Nevo</h2>
            <p className="mt-2 leading-relaxed">
              By creating an account, you agree to use Nevo to plan meals and manage health
              information for yourself and the family members you add, and not to misuse the
              service or attempt to access accounts that aren&apos;t yours.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">Not medical advice</h2>
            <p className="mt-2 leading-relaxed">
              Diet plans on Nevo are general guidance, not a substitute for advice from a doctor or
              registered dietitian. Always consult a qualified professional for medical decisions,
              especially for serious conditions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">Your account</h2>
            <p className="mt-2 leading-relaxed">
              You&apos;re responsible for keeping your password secure and for the accuracy of the
              health information you enter for your family.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-nevo-ink">Changes</h2>
            <p className="mt-2 leading-relaxed">
              We may update these terms as the product evolves. Significant changes will be
              communicated through the app.
            </p>
          </div>

          <p className="rounded-lg border border-nevo-line bg-nevo-panel px-4 py-3 text-xs text-nevo-ink-mute">
            This is a starting template, not legal advice. Have it reviewed by a lawyer before
            relying on it in production, particularly given the health-data context.
          </p>
        </div>
      </div>
    </section>
  );
}
