import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@/shared'],
  serverExternalPackages: ['zod'],
  // Allow build to fail on lint or type errors
  eslint: {
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  experimental: {
    // ... existing experimental options can remain here
  },
  // Ensure monorepo files outside the app are traced correctly
  outputFileTracingRoot: resolve(__dirname, '../../'),
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/shared': resolve(__dirname, '../../shared')
    };
    return config;
  }
};

export default nextConfig;