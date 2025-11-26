'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import api from '@/lib/api';
import { API_V1_URL } from '@/lib/config';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  dailyUsage: Array<{ date: string; count: number }>;
}

interface UserProfile {
  id: number | string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, login, logout, user: privyUser } = usePrivy();
  const { wallets } = useWallets();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log('Privy ready:', ready, 'authenticated:', authenticated);
    console.log('Wallets:', wallets);
    console.log('Privy user:', privyUser);

    if (ready && !authenticated) {
      // Redirect to login if not authenticated
      router.push('/');
    } else if (ready && authenticated) {
      // Wait a bit for wallets to load, then fetch data
      const timer = setTimeout(() => {
        fetchDashboardData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ready, authenticated, router]);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      console.log('Available wallets:', wallets);
      
      // Try different methods to get wallet address
      let walletAddress = null;

      // Method 1: Find from wallets array
      if (wallets && wallets.length > 0) {
        const solanaWallet = wallets[0]; // Use first wallet
        walletAddress = solanaWallet?.address;
        console.log('Wallet from wallets array:', walletAddress);
      }

      // Method 2: Get from Privy user object
      if (!walletAddress && privyUser) {
        // Check different possible locations for wallet address
        const possibleAddresses = [
          (privyUser as any)?.wallet?.address,
          (privyUser as any)?.solana?.address,
          (privyUser as any)?.linkedAccounts?.find((acc: any) => acc.type === 'wallet')?.address,
        ];
        
        walletAddress = possibleAddresses.find(addr => addr);
        console.log('Wallet from Privy user:', walletAddress);
      }

      if (!walletAddress) {
        console.error('No wallet address found');
        setError('No Solana wallet connected. Please reconnect your wallet.');
        setLoading(false);
        return;
      }
      
      await authenticateWallet(walletAddress);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data: ' + err.message);
      setLoading(false);
    }
  };

  const authenticateWallet = async (walletAddress: string) => {
    try {
      console.log('Authenticating wallet:', walletAddress);

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
          id: authResult.data.user.id,
          name: authResult.data.user.name,
          email: walletAddress,
        });

        // Set default stats
        setStats({
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0,
          dailyUsage: [],
        });
        
        setError('');
      } else {
        setError('Failed to authenticate wallet: ' + (authResult.error?.message || 'Unknown error'));
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Wallet authentication error:', err);
      setError('Failed to authenticate wallet: ' + err.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const chartData = {
    labels: stats?.dailyUsage.map((d) => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'API Requests',
        data: stats?.dailyUsage.map((d) => d.count) || [],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-black flex flex-col">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <img src="/cropped_circle_image.png" alt="Qwery Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Qwery
                </h1>
              </div>
              <div className="hidden lg:flex space-x-2 xl:space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-orange-500 bg-orange-500/10 font-semibold"
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-keys"
                  className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  API Keys
                </Link>
                <Link
                  href="/documentation"
                  className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-xs sm:text-sm md:text-base text-gray-300 font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm"
              >
                Logout
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-orange-500 bg-orange-500/10 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-keys"
                  className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  API Keys
                </Link>
                <Link
                  href="/documentation"
                  className="px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Documentation
                </Link>
                <div className="pt-2 border-t border-gray-800">
                  <p className="px-3 py-2 text-sm text-gray-400">{user?.name}</p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 sm:pb-32 w-full">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-400">Here's your API usage overview</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Cards - REMOVED */}
        
        {/* Chart Section */}
        {stats?.dailyUsage && stats.dailyUsage.length > 0 ? (
          <div className="bg-black rounded-xl shadow-sm p-6 border border-gray-800 min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6">Usage Over Time</h3>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="bg-black rounded-xl shadow-sm p-12 border border-gray-800 text-center min-h-[400px] flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Usage Data Yet</h3>
            <p className="text-gray-400 mb-6">Start making API requests to see your usage statistics</p>
            <Link
              href="/api-keys"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Create API Key
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
