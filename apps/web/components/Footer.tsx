import Link from 'next/link';

const columns = [
  {
    title: 'Product',
    links: [
      { href: 'features', label: 'Features' },
      { href: 'pricing', label: 'Pricing' },
      { href: 'demo', label: 'Demo' },
      { href: 'login', label: 'Sign in' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: 'about', label: 'About us' },
      { href: 'contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: 'privacy', label: 'Privacy policy' },
      { href: 'terms', label: 'Terms of service' },
    ],
  },
];

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-nevo-line bg-nevo-panel">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="Nevo" className="h-7 w-7" />
              <span className="font-display text-lg font-semibold text-nevo-ink">Nevo</span>
            </div>
            <p className="mt-3 text-sm text-nevo-ink-dim">
              Your family nutrition and wellness platform.
            </p>
            <p className="mt-4 text-xs text-nevo-ink-mute">
              Built by{' '}
              <a
                href="https://software.navicore.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-nevo-accent transition-colors hover:text-nevo-accent-dim"
              >
                Navicore Software
              </a>
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-nevo-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}/${link.href}`}
                      className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center border-t border-nevo-line pt-6">
          <p className="text-xs text-nevo-ink-mute">
            © {new Date().getFullYear()} Nevo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
