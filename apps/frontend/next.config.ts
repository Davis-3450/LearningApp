import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@/shared']
  },
  webpack: (config: any) => {
    // Handle shared directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/shared': require('path').resolve(__dirname, '../../shared')
    };
    return config;
  }
};

export default nextConfig;
