import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dangerously allow production builds to successfully complete even if
  // your project has type errors.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Completely bypass ESLint checking during the production build step.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
