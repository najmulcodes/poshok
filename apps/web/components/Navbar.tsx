'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const navLinks = [
  { href: 'features', label: 'Features' },
  { href: 'pricing', label: 'Pricing' },
  { href: 'about', label: 'About' },
  { href: 'contact', label: 'Contact' },
];

export function Navbar() {
  const params = useParams();
  const locale = params?.locale || 'en';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-nevo-line bg-nevo-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Nevo" className="h-7 w-7" />
          <span className="font-display text-lg font-medium text-nevo-ink">Nevo</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}/${link.href}`}
              className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={`/${locale}/login`}
            className="hidden text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink sm:inline"
          >
            Sign in
          </Link>
          <Link
            href={`/${locale}/register`}
            className="rounded-lg bg-nevo-gold px-4 py-2 text-sm font-semibold text-nevo-bg transition-colors hover:bg-nevo-gold-dim"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
