'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import api from '@/lib/api';
import { API_V1_URL, API_BASE_URL } from '@/lib/config';

interface UserProfile {
  name: string;
}

interface Endpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  example: string;
}

export default function DocumentationPage() {
  const router = useRouter();
  const { ready, authenticated, logout, user: privyUser } = usePrivy();
  const { wallets } = useWallets();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Documentation - Privy ready:', ready, 'authenticated:', authenticated);
    console.log('Documentation - Wallets:', wallets);
    console.log('Documentation - Privy user:', privyUser);

    if (ready && !authenticated) {
      router.push('/');
    } else if (ready && authenticated) {
      // Wait a bit for wallets to load
      const timer = setTimeout(() => {
        fetchUser();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ready, authenticated, router]);

  const fetchUser = async () => {
    try {
      console.log('Fetching documentation user data...');
      console.log('Available wallets:', wallets);
      console.log('Privy user object:', privyUser);
      
      // Try different methods to get wallet address
      let walletAddress = null;

      // Method 1: Find from wallets array
      if (wallets && wallets.length > 0) {
        const solanaWallet = wallets[0]; // Use first wallet
        walletAddress = solanaWallet?.address;
        console.log('Method 1 - Wallet from wallets array:', walletAddress);
      }

      // Method 2: Get from Privy user object (try multiple paths)
      if (!walletAddress && privyUser) {
        console.log('Trying Method 2 - Checking Privy user paths...');
        
        // Try different possible paths
        const possibleAddresses = [
          (privyUser as any)?.wallet?.address,
          (privyUser as any)?.solana?.address,
          (privyUser as any)?.linkedAccounts?.find((acc: any) => acc.type === 'wallet')?.address,
        ];
        
        walletAddress = possibleAddresses.find(addr => addr);
        console.log('Method 2 - Wallet from Privy user:', walletAddress);
      }

      if (!walletAddress) {
        console.error('No wallet address found after all attempts');
        console.log('Wallets state:', wallets);
        console.log('Privy user state:', privyUser);
        setError('No Solana wallet connected. Please reconnect your wallet.');
        setLoading(false);
        return;
      }

      console.log('Final wallet address to authenticate:', walletAddress);

      // Authenticate wallet with backend
      const authResponse = await fetch(`${API_V1_URL}/auth/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const authResult = await authResponse.json();
      console.log('Auth result:', authResult);

      if (authResponse.ok && authResult.status === 'success') {
        setUser({
          name: authResult.data.user.name,
        });
        setError('');
      } else {
        setError('Failed to authenticate wallet: ' + (authResult.error?.message || 'Unknown error'));
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError('Failed to load user data: ' + err.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const endpoints: Endpoint[] = [
    {
      name: 'Token Price',
      method: 'POST',
      path: '/api/v1/token-price',
      description: 'Get the current price of one or more Solana tokens',
      parameters: [
        { name: 'tokenAddresses', type: 'array', required: true, description: 'Array of token contract addresses' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/token-price \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"tokenAddresses": ["So11111111111111111111111111111111111111112"]}'`,
    },
    {
      name: 'Token Metadata',
      method: 'POST',
      path: '/api/v1/token-metadata',
      description: 'Get metadata for a Solana token including name, symbol, and decimals',
      parameters: [
        { name: 'tokenAddress', type: 'string', required: true, description: 'Token contract address' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/token-metadata \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"tokenAddress": "So11111111111111111111111111111111111111112"}'`,
    },
    {
      name: 'Top Holders',
      method: 'POST',
      path: '/api/v1/top-holders',
      description: 'Get the top holders of a specific token',
      parameters: [
        { name: 'mint', type: 'string', required: true, description: 'Token contract address' },
        { name: 'limit', type: 'number', required: false, description: 'Number of holders to return (default: 10)' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/top-holders \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"mint": "So11111111111111111111111111111111111111112", "limit": 20}'`,
    },
    {
      name: 'Latest Trades',
      method: 'POST',
      path: '/api/v1/latest-trades',
      description: 'Get the latest trades across all tokens',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of trades to return (default: 20)' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/latest-trades \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"limit": 50}'`,
    },
    {
      name: 'Wallet Trades',
      method: 'POST',
      path: '/api/v1/wallet-trades',
      description: 'Get all trades for a specific wallet address',
      parameters: [
        { name: 'wallet', type: 'string', required: true, description: 'Wallet address' },
        { name: 'limit', type: 'number', required: false, description: 'Number of trades to return (default: 50)' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/wallet-trades \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"wallet": "YOUR_WALLET_ADDRESS", "limit": 100}'`,
    },
    {
      name: 'Balance Updates',
      method: 'POST',
      path: '/api/v1/balance-updates',
      description: 'Get balance updates for specific criteria',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of updates to return' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/balance-updates \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"limit": 100}'`,
    },
    {
      name: 'Bonding Curve',
      method: 'POST',
      path: '/api/v1/bonding-curve',
      description: 'Get tokens on bonding curve',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return (default: 50)' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/bonding-curve \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"limit": 100}'`,
    },
    {
      name: 'Top Pumpfun Tokens',
      method: 'POST',
      path: '/api/v1/top-pumpfun-tokens',
      description: 'Get top performing Pumpfun tokens',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return (default: 50)' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/top-pumpfun-tokens \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"limit": 50}'`,
    },
    {
      name: 'Letsbonk Bonding Curve',
      method: 'POST',
      path: '/api/v1/letsbonk-bonding-curve',
      description: 'Get Letsbonk tokens on bonding curve',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/letsbonk-bonding-curve \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{}'`,
    },
    {
      name: 'Letsbonk Above 95%',
      method: 'POST',
      path: '/api/v1/letsbonk-above-95',
      description: 'Get Letsbonk tokens above 95% progress',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/letsbonk-above-95 \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{}'`,
    },
    {
      name: 'Raydium Bonding Curve',
      method: 'POST',
      path: '/api/v1/raydium-bonding-curve',
      description: 'Get Raydium tokens on bonding curve',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/raydium-bonding-curve \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{}'`,
    },
    {
      name: 'Raydium Above 95%',
      method: 'POST',
      path: '/api/v1/raydium-above-95',
      description: 'Get Raydium tokens above 95% progress',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/raydium-above-95 \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{}'`,
    },
    {
      name: 'Raydium Graduated',
      method: 'POST',
      path: '/api/v1/raydium-graduated',
      description: 'Get tokens that have graduated to Raydium',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of tokens to return (default: 50)' },
      ],
      example: `curl -X POST http://localhost:3000/api/v1/raydium-graduated \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: qwery_your_key_here" \\
  -d '{"limit": 50}'`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading documentation...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img src="/cropped_circle_image.png" alt="Qwery Logo" className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Qwery
                </h1>
              </div>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-keys"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  API Keys
                </Link>
                <Link
                  href="/documentation"
                  className="px-3 py-2 rounded-lg text-orange-600 bg-orange-50 font-semibold"
                >
                  Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => fetchUser()}
              className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h2>
          <p className="text-gray-600">Complete reference for all available Qwery API endpoints</p>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Getting Started</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              To use the Qwery API, you need to include your API key in the request headers:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-600">// Request Header</div>
              <div className="text-orange-600">x-api-key: YOUR_API_KEY</div>
            </div>
            <p>
              <strong>Base URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/api/v1</code>
            </p>
            <p>
              <strong>API Key Header:</strong> <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key: qwery_your_key_here</code>
            </p>
            <p>
              All endpoints use <strong>POST</strong> method with JSON body. All responses return JSON. Rate limiting is applied to ensure fair usage.
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Available Endpoints</h3>
          
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Endpoint Header */}
              <div className="bg-gray-50 p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{endpoint.name}</h4>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {endpoint.method}
                  </span>
                </div>
                <code className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg inline-block">
                  {endpoint.path}
                </code>
                <p className="text-gray-600 mt-3">{endpoint.description}</p>
              </div>

              {/* Endpoint Details */}
              <div className="p-6 space-y-4">
                {/* Parameters */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Parameters</h5>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-start space-x-3 text-sm">
                          <code className="bg-gray-100 px-2 py-1 rounded text-orange-600 font-mono">
                            {param.name}
                          </code>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            param.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {param.required ? 'required' : 'optional'}
                          </span>
                          <span className="text-gray-600">
                            <span className="font-medium">{param.type}</span> - {param.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Example Request</h5>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-green-400 text-sm font-mono whitespace-pre">
                      {endpoint.example}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rate Limiting Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Rate Limiting</h4>
              <p className="text-yellow-800 text-sm">
                API requests are rate-limited to ensure fair usage. If you exceed your rate limit, 
                you'll receive a 429 (Too Many Requests) response. Check the response headers for 
                rate limit information.
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-800 text-sm">
                If you have any questions or need assistance, please check the{' '}
                <Link href="/dashboard" className="underline hover:text-blue-900">dashboard</Link>
                {' '}for usage statistics or contact support for additional help.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
