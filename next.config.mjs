import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Performance optimizations
  compress: true, // Enable gzip compression

  // Keep production source maps off (plan-performance-seo-privacy F10);
  // re-enable locally when debugging
  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // Compiler options to reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
