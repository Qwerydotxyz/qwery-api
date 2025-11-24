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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <img src="/cropped_circle_image.png" alt="Qwery Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Qwery
                </h1>
              </div>
              <div className="hidden lg:flex space-x-2 xl:space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-orange-600 bg-orange-50 font-semibold"
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-keys"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  API Keys
                </Link>
                <Link
                  href="/documentation"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-xs sm:text-sm md:text-base text-gray-700 font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
              >
                Logout
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-orange-600 bg-orange-50 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-keys"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  API Keys
                </Link>
                <Link
                  href="/documentation"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Documentation
                </Link>
                <div className="pt-2 border-t border-gray-100">
                  <p className="px-3 py-2 text-sm text-gray-600">{user?.name}</p>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Here's your API usage overview</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Cards - REMOVED */}
        
        {/* Chart Section */}
        {stats?.dailyUsage && stats.dailyUsage.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Usage Over Time</h3>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center min-h-[400px] flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Usage Data Yet</h3>
            <p className="text-gray-600 mb-6">Start making API requests to see your usage statistics</p>
            <Link
              href="/api-keys"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Create API Key
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-500">
                <li><a href="https://qwery.xyz" className="hover:text-gray-700">Website</a></li>
                <li><a href="https://dashboard.qwery.xyz" className="hover:text-gray-700">Dashboard</a></li>
                <li><a href="https://docs.qwery.xyz" className="hover:text-gray-700">Documentation</a></li>
                <li><a href="https://www.npmjs.com/package/@qwerydotxyz/qwery-sdk" className="hover:text-gray-700">npm Package</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-500">
                <li><a href="https://github.com/Qwerydotxyz/qwery-api" className="hover:text-gray-700">Qwery API</a></li>
                <li><a href="https://github.com/Qwerydotxyz/qwery-x402-facilitator" className="hover:text-gray-700">x402 Facilitator</a></li>
                <li><a href="https://github.com/Qwerydotxyz/qwery-sdk" className="hover:text-gray-700">SDK (TypeScript)</a></li>
                <li><span className="text-gray-300">SDK (Rust) - Soon</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-500">
                <li><a href="https://docs.qwery.xyz" className="hover:text-gray-700">Documentation</a></li>
                <li><a href="https://discord.com/invite/yYXFvERr" className="hover:text-gray-700">Discord</a></li>
                <li><a href="mailto:support@qwery.xyz" className="hover:text-gray-700">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-500">
                <li><a href="https://qwery.xyz" className="hover:text-gray-700">About</a></li>
                <li><a href="https://medium.com/@qwerydotxyz" className="hover:text-gray-700">Blog</a></li>
                <li><span className="text-gray-300">Careers - Soon</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 md:mt-12 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs md:text-sm text-gray-500 order-2 md:order-1">© 2025 Qwery. All rights reserved.</p>
              <div className="flex gap-4 order-1 md:order-2">
                <button onClick={() => setShowTerms(true)} className="text-xs md:text-sm text-gray-500 hover:text-gray-700">Terms</button>
                <button onClick={() => setShowPrivacy(true)} className="text-xs md:text-sm text-gray-500 hover:text-gray-700">Privacy</button>
              </div>
              <div className="flex gap-3 md:gap-4 order-3">
                <a href="https://x.com/qwerydotxyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://github.com/qwerydotxyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                <a href="https://discord.com/invite/yYXFvERr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a>
                <a href="https://www.youtube.com/@qwerydotxyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                <a href="https://medium.com/@qwerydotxyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
