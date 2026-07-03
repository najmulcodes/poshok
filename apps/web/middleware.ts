import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'bn'],
  defaultLocale: 'bn',
  localePrefix: 'always' // /en/... and /bn/...
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(bn|en)/:path*']
};