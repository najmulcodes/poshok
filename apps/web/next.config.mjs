import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // You can add other Next.js configuration here if needed.
};

export default withNextIntl(nextConfig);