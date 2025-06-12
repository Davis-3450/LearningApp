import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@/shared'],
  webpack: (config) => {
    // Handle shared directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/shared': resolve(__dirname, '../../shared')
    };
    return config;
  }
};

export default nextConfig;
