import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Standalone output for better deployment
  output: 'standalone',
  
  // External packages that should not be bundled
  serverExternalPackages: [
    'thread-stream',
    'pino',
    'pino-pretty',
    '@walletconnect/logger',
    '@reown/appkit',
    '@reown/appkit-utils',
    '@reown/appkit-controllers',
  ],
};

export default nextConfig;
