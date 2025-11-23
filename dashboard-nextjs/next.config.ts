import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  webpack: (config, { isServer }) => {
    // Exclude test files from being processed
    config.module.rules.push({
      test: /\.test\.(js|ts|jsx|tsx)$/,
      type: 'javascript/auto',
      use: 'null-loader',
    });

    // Fix for Node.js modules that shouldn't be bundled in client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        'worker_threads': false,
        'pino-abstract-transport': false,
        'thread-stream': false,
        'tap': false,
      };
    }

    return config;
  },
  
  // Only transpile necessary packages
  transpilePackages: ['@privy-io/react-auth'],
  
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
