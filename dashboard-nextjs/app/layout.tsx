import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dashboard.qwery.xyz'),
  title: "Qwery - Solana's developer infrastructure",
  description: "Architecting Solana’s developer infrastructure with APIs, modular SDKs, and high-performance x402-based facilitation layers.",
  applicationName: "Qwery",
  authors: [{ name: "Qwery" }],
  keywords: ["Solana", "API", "Blockchain", "Phantom Wallet", "Crypto", "Web3"],
  icons: {
    icon: [
      { url: '/cropped_circle_image.png', sizes: '32x32', type: 'image/png' },
      { url: '/cropped_circle_image.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/cropped_circle_image.png',
    apple: '/cropped_circle_image.png',
    other: [
      { rel: 'icon', url: '/cropped_circle_image.png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dashboard.qwery.xyz',
    title: 'Qwery - Solana API Platform',
    description: 'Solana blockchain data API with Phantom wallet authentication',
    siteName: 'Qwery',
    images: [
      {
        url: '/cropped_circle_image.png',
        width: 512,
        height: 512,
        alt: 'Qwery Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Qwery - Solana API Platform',
    description: 'Solana blockchain data API with Phantom wallet authentication',
    images: ['/cropped_circle_image.png'],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force dark mode immediately
              document.documentElement.classList.add('dark');
              localStorage.setItem('theme', 'dark');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col bg-black text-white`}
      >
        <Providers>
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
