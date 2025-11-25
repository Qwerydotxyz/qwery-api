'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();

  useEffect(() => {
    if (ready && authenticated) {
      // If already authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  const handleLogin = () => {
    login();
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-white dark:bg-black flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-black border-b border-gray-100 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/cropped_circle_image.png" alt="Qwery Logo" className="w-8 h-8" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Qwery</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleLogin}
                className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 w-full">
        <div className="text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img src="/cropped_circle_image.png" alt="Qwery Logo" className="w-20 h-20 sm:w-24 sm:h-24" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
            Welcome to Qwery
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-neutral-500 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Access powerful Solana blockchain data through our API. Connect your Phantom wallet to get started.
          </p>
          <button
            onClick={handleLogin}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-orange-600 transition-colors inline-flex items-center space-x-2"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Connect Phantom Wallet</span>
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast & Reliable</h3>
            <p className="text-gray-600 dark:text-neutral-500">Access real-time Solana blockchain data with low latency and high reliability.</p>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Access</h3>
            <p className="text-gray-600 dark:text-neutral-500">Wallet-based authentication ensures secure and decentralized access control.</p>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-100 dark:border-neutral-800">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Integration</h3>
            <p className="text-gray-600 dark:text-neutral-500">Simple REST API with comprehensive documentation to get you started quickly.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

