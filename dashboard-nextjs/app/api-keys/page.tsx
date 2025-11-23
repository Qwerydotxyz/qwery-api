'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import api from '@/lib/api';
import { API_V1_URL } from '@/lib/config';

interface ApiKey {
  id: number | string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
  requestCount: number;
}

interface UserProfile {
  name: string;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const { ready, authenticated, logout, user: privyUser } = usePrivy();
  const { wallets } = useWallets();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    console.log('API Keys - Privy ready:', ready, 'authenticated:', authenticated);
    console.log('API Keys - Wallets:', wallets);
    console.log('API Keys - Privy user:', privyUser);

    if (ready && !authenticated) {
      router.push('/');
    } else if (ready && authenticated) {
      // Wait a bit for wallets to load
      const timer = setTimeout(() => {
        fetchData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ready, authenticated, router]);

  const fetchData = async () => {
    try {
      console.log('Fetching API keys data...');
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
      
      // Store wallet address in state for use in other functions
      setWalletAddress(walletAddress);

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

        // Create wallet-specific localStorage key
        const storageKey = `apiKeys_${walletAddress}`;
        
        // Get stored full keys from localStorage (wallet-specific)
        const storedKeys = localStorage.getItem(storageKey);
        const fullKeysMap: { [id: string]: string } = {};
        
        if (storedKeys) {
          try {
            const parsedKeys = JSON.parse(storedKeys);
            console.log('📦 Loaded stored keys from localStorage:', parsedKeys.length);
            // Create a map of id -> full key for keys that have full keys stored
            parsedKeys.forEach((key: any) => {
              if (key.key && key.key.startsWith('qwery_') && key.key.length > 20) {
                fullKeysMap[key.id] = key.key;
                console.log('✅ Found full key for ID:', key.id);
              }
            });
          } catch (e) {
            console.error('Error parsing stored keys:', e);
          }
        } else {
          console.log('📭 No stored keys found in localStorage for this wallet');
        }

        // Transform backend data and merge with stored full keys
        const transformedKeys = authResult.data.apiKeys.map((key: any) => ({
          id: key.id,
          key: fullKeysMap[key.id] || key.keyPrefix, // Use full key if available, otherwise prefix
          name: key.name,
          createdAt: key.createdAt,
          lastUsed: key.lastUsedAt,
          requestCount: key.requestCount || 0,
        }));
        
        console.log('🔑 Total API keys loaded:', transformedKeys.length);
        console.log('💾 Full keys preserved:', Object.keys(fullKeysMap).length);
        
        setApiKeys(transformedKeys);
        
        // Update localStorage with merged data (wallet-specific)
        localStorage.setItem(storageKey, JSON.stringify(transformedKeys));
        
        setError('');
      } else {
        setError('Failed to authenticate wallet: ' + (authResult.error?.message || 'Unknown error'));
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to load API keys: ' + err.message);
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    try {
      // Call backend API to create key
      const response = await fetch(`${API_V1_URL}/dashboard/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName || 'My API Key',
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        // Backend returns the full API key only once
        const fullApiKey = result.data.apiKey;
        
        const newKey = {
          id: result.data.id,
          key: fullApiKey, // Full key shown once
          name: result.data.name,
          createdAt: result.data.createdAt,
          lastUsed: result.data.lastUsedAt,
          requestCount: 0,
        };
        
        // Add to state immediately
        const updatedKeys = [...apiKeys, newKey];
        setApiKeys(updatedKeys);
        
        // Save full key to localStorage (wallet-specific) so it persists
        if (walletAddress) {
          const storageKey = `apiKeys_${walletAddress}`;
          localStorage.setItem(storageKey, JSON.stringify(updatedKeys));
          console.log('💾 Saved new key to localStorage for wallet:', walletAddress);
        }
        
        setSuccess(`✅ API key created successfully! Copy it now and save it securely.`);
        setNewlyCreatedKey(fullApiKey); // Show in special alert box
        setNewKeyName('');
        setShowCreateForm(false);
        
        // DON'T refresh from backend - that would replace the full key with just the prefix
        // The key is already saved in localStorage and will persist across sessions
      } else {
        throw new Error(result.error?.message || 'Failed to create API key');
      }
    } catch (err: any) {
      console.error('Create key error:', err);
      setError(err.message || 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: number | string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      // Call backend API to delete
      const response = await fetch(`${API_V1_URL}/dashboard/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        // Remove from state
        const updatedKeys = apiKeys.filter(key => key.id !== keyId);
        setApiKeys(updatedKeys);
        
        // Update localStorage (wallet-specific)
        if (walletAddress) {
          const storageKey = `apiKeys_${walletAddress}`;
          localStorage.setItem(storageKey, JSON.stringify(updatedKeys));
          console.log('🗑️ Deleted key from localStorage for wallet:', walletAddress);
        }
        
        setSuccess('API key deleted successfully from database');
      } else {
        throw new Error(result.error?.message || 'Failed to delete');
      }
    } catch (err: any) {
      console.error('Delete key error:', err);
      setError(err.message || 'Failed to delete API key');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading API keys...</p>
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
          <div className="flex justify-between items-center h-16 flex-wrap sm:flex-nowrap gap-2">
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
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/api-keys"
                  className="px-3 py-2 rounded-lg text-orange-600 bg-orange-50 font-semibold"
                >
                  API Keys
                </Link>
                <Link
                  href="/documentation"
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">API Keys</h2>
            <p className="text-sm sm:text-base text-gray-600">Manage your API keys for accessing the Qwery API</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            {showCreateForm ? 'Cancel' : '+ New API Key'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => fetchData()}
              className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Newly Created Key Alert - Special Highlight */}
        {newlyCreatedKey && (
          <div className="mb-6 p-6 bg-orange-50 border-2 border-orange-500 rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🎉 Your New API Key (Save This Now!)</h3>
                <p className="text-sm text-gray-700 mb-4">
                  This is the only time you'll see the full key. Copy it and save it securely. It's already saved in your browser's localStorage.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <code className="flex-1 px-4 py-3 bg-white border-2 border-orange-300 rounded-lg text-sm font-mono text-gray-900 break-all">
                    {newlyCreatedKey}
                  </code>
                  <button
                    onClick={() => {
                      handleCopyKey(newlyCreatedKey);
                      setTimeout(() => setNewlyCreatedKey(null), 3000); // Hide after copying
                    }}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex-shrink-0"
                  >
                    {copiedKey === newlyCreatedKey ? '✓ Copied!' : 'Copy Key'}
                  </button>
                </div>
                <button
                  onClick={() => setNewlyCreatedKey(null)}
                  className="text-sm text-orange-600 hover:text-orange-800 underline"
                >
                  I've saved it, dismiss this
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New API Key</h3>
            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  id="keyName"
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Production API Key"
                />
                <p className="text-xs text-gray-500 mt-1">Give your API key a descriptive name</p>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create API Key'}
              </button>
            </form>
          </div>
        )}

        {/* API Keys List */}
        {apiKeys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No API Keys Yet</h3>
            <p className="text-gray-600 mb-6">Create your first API key to start using the Qwery API</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Create Your First Key
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey, index) => (
              <div
                key={apiKey.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{apiKey.name}</h4>
                      {apiKey.key.length > 20 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Full Key Saved
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded">
                          Prefix Only
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <code className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-700 flex-1 break-all">
                        {apiKey.key}
                      </code>
                      <button
                        onClick={() => handleCopyKey(apiKey.key)}
                        className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedKey === apiKey.key ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {apiKey.key.length <= 20 && (
                      <p className="text-xs text-amber-600 mb-2">
                        ⚠️ This is a preview. Full key was shown only once during creation.
                      </p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>
                        Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Requests: {apiKey.requestCount}
                      </span>
                      {apiKey.lastUsed && (
                        <span>
                          Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="ml-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete API key"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How API Keys Work</h4>
              <ul className="text-gray-700 text-sm space-y-2 list-disc list-inside">
                <li>
                  <strong>Full Keys:</strong> When you create an API key, the full key is saved in your browser's localStorage and will persist as long as you use the same browser and don't clear your cache.
                </li>
                <li>
                  <strong>Prefix Only:</strong> If you clear your browser cache or use a different device, you'll only see the key prefix (first 13 characters). The full key is stored securely in the database but never shown again.
                </li>
                <li>
                  All API keys start with <code className="bg-gray-200 px-2 py-1 rounded">qwery_</code> prefix
                </li>
                <li>
                  Include your API key in requests using the header: <code className="bg-gray-200 px-2 py-1 rounded">X-API-Key: YOUR_KEY</code>
                </li>
                <li>
                  <strong>Security:</strong> Keep your API keys secure and never share them publicly. Delete any keys you're no longer using.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
