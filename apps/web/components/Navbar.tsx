'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export function Navbar() {
  const params = useParams();
  const locale = params?.locale || 'en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="Nevo Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-white">Nevo</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/features`} className="text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href={`/${locale}/pricing`} className="text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href={`/${locale}/about`} className="text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href={`/${locale}/contact`} className="text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href={`/${locale}/login`}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={`/${locale}/register`}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
