'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: 'features', label: 'Features' },
  { href: 'pricing', label: 'Pricing' },
  { href: 'about', label: 'About' },
  { href: 'contact', label: 'Contact' },
];

export function Navbar() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push(`/${locale}`);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-nevo-line bg-nevo-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="Nevo" className="h-7 w-7" />
          <span className="font-display text-lg font-semibold text-nevo-ink">Nevo</span>
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

        <div className="hidden items-center gap-5 md:flex">
          {!loading && user ? (
            <>
              <Link
                href={`/${locale}/dashboard`}
                className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-nevo-line px-4 py-2 text-sm font-medium text-nevo-ink transition-colors hover:border-nevo-ink-mute"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/${locale}/login`}
                className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
              >
                Sign in
              </Link>
              <Link
                href={`/${locale}/register`}
                className="rounded-lg bg-nevo-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-nevo-accent-dim"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-nevo-ink md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-nevo-line bg-nevo-bg px-6 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}/${link.href}`}
                onClick={() => setOpen(false)}
                className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 flex flex-col gap-3 border-t border-nevo-line pt-4">
              {!loading && user ? (
                <>
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg border border-nevo-line px-4 py-2 text-center text-sm font-medium text-nevo-ink"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-nevo-ink-dim transition-colors hover:text-nevo-ink"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-nevo-accent px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
