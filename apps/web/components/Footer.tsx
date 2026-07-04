import Link from 'next/link';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { href: 'features', label: 'Features' },
      { href: 'pricing', label: 'Pricing' },
      { href: 'diet-plans', label: 'Diet plans' },
      { href: 'nutrition', label: 'Nutrition tracking' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: 'about', label: 'About us' },
      { href: 'contact', label: 'Contact' },
      { href: 'blog', label: 'Blog' },
      { href: 'careers', label: 'Careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: 'privacy', label: 'Privacy policy' },
      { href: 'terms', label: 'Terms of service' },
      { href: 'security', label: 'Security' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-nevo-line bg-nevo-panel">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="Nevo" className="h-7 w-7" />
              <span className="font-display text-lg font-medium text-nevo-ink">Nevo</span>
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
                className="text-nevo-gold transition-colors hover:text-nevo-gold-dim"
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
                      href={`/en/${link.href}`}
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-nevo-line pt-6 md:flex-row">
          <p className="text-xs text-nevo-ink-mute">
            © {new Date().getFullYear()} Nevo. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" aria-label="Instagram" className="text-nevo-ink-mute transition-colors hover:text-nevo-ink">
              <Instagram className="h-5 w-5" strokeWidth={1.75} />
            </a>
            <a href="#" aria-label="Facebook" className="text-nevo-ink-mute transition-colors hover:text-nevo-ink">
              <Facebook className="h-5 w-5" strokeWidth={1.75} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-nevo-ink-mute transition-colors hover:text-nevo-ink">
              <Linkedin className="h-5 w-5" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
