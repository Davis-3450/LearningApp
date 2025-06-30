import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@/shared'],
  serverExternalPackages: ['zod'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Enable for better performance in production
    optimizePackageImports: ['lucide-react'],
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
  },
  // Allow cross-origin requests in development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-API-Key' },
        ],
      },
    ];
  },
  // Configure environment variables for production
  env: {
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },
};

export default nextConfig;