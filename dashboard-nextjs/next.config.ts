import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Empty config to acknowledge Turbopack usage and silence the warning
  },
  
  // Only transpile necessary packages
  transpilePackages: ['@privy-io/react-auth'],
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Server component configuration
  experimental: {
    serverComponentsExternalPackages: [
      'pino',
      'pino-pretty',
      'thread-stream',
      'pino-abstract-transport',
    ],
  },
};

export default nextConfig;
