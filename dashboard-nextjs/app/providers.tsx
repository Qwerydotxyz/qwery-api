'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmhpop6dv006ijn0cutytdmv5'}
      config={{
        // 🎨 UI customization
        appearance: {
          theme: 'light',
          accentColor: '#f97316', // orange QWERY brand color
          logo: '/cropped_circle_image.png',
          walletChainType: 'solana-only', // restrict to Solana wallets only
          walletList: ['phantom'], // Only Phantom wallet
          showWalletLoginFirst: true,
        },

        // 🔐 Login options (wallet only for Solana)
        loginMethods: ['wallet'],

        // 🔗 External Solana wallet connectors
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },

        // 📱 Embedded wallet settings
        embeddedWallets: {
          createOnLogin: 'off', // Don't create embedded wallets
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
