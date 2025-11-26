"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Twitter, Github, Youtube, X } from "lucide-react"

export function Footer() {
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <footer className="relative z-20 border-t border-gray-800 bg-black">
        <div className="mx-auto py-8 md:py-10 pb-6 md:pb-8">
          {/* Logo and Subscribe Section on Left */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12 mb-10 md:mb-12 px-6 lg:px-12">
            {/* Logo Section - Perfect vertical alignment */}
            <div className="flex-shrink-0 animate-fade-in-up">
              <div className="flex items-center gap-2.5 mb-6">
                <Image
                  src="/cropped_circle_image.png"
                  alt="Qwery"
                  width={40}
                  height={40}
                  className="w-10 h-10 flex-shrink-0"
                />
                <span className="font-mono text-lg leading-none text-white">qwery</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-gray-400 mb-3.5 leading-relaxed">Subscribe to status updates</p>
                <Link
                  href="/subscribe"
                  className="inline-block text-[#F29146] hover:text-[#F29146]/80 transition-colors duration-300 text-sm font-medium"
                >
                  Subscribe
                </Link>
              </div>
            </div>

            {/* Navigation Columns - All horizontally aligned */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 flex-1">
              {/* Product Column */}
              <div className="animate-fade-in-up animation-delay-100">
                <h3 className="font-semibold text-sm mb-4 text-white">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Website
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://dashboard.qwery.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://docs.qwery.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.npmjs.com/package/@qwerydotxyz/qwery-sdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      npm Package
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Platform Column */}
              <div className="animate-fade-in-up animation-delay-200">
                <h3 className="font-semibold text-sm mb-4 text-white">Platform</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="https://dashboard.qwery.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Qwery API
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://status.qwery.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      x402 Facilitator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://pypi.org/project/qwery-sdk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      SDK (Python)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://crates.io/crates/qwery-sdk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      SDK (Rust)
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Column */}
              <div className="animate-fade-in-up animation-delay-300">
                <h3 className="font-semibold text-sm mb-4 text-white">Support</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="https://docs.qwery.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://discord.com/invite/qwerydotxyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Discord
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div className="animate-fade-in-up animation-delay-400">
                <h3 className="font-semibold text-sm mb-4 text-white">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setShowAbout(true)}
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300 text-left"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <Link
                      href="https://medium.com/@qwerydotxyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-[#F29146] transition-colors duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <span className="text-sm text-gray-500">Careers - Soon</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section - Terms, Copyright, Social */}
          <div className="flex flex-col items-center gap-4 pt-8 border-t border-gray-800 animate-fade-in-up animation-delay-500 px-6 lg:px-12">
            {/* Terms and Privacy */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="#terms"
                className="text-gray-400 hover:text-[#F29146] transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                href="#privacy"
                className="text-gray-400 hover:text-[#F29146] transition-colors duration-300"
              >
                Privacy
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center">© 2025 Qwery. All rights reserved.</p>

            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <Link
                href="https://x.com/qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com/Qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://discord.com/invite/qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.076.076 0 0 0 .084.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span className="sr-only">Discord</span>
              </Link>
              <Link
                href="https://www.youtube.com/@qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                href="https://medium.com/@qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
                <span className="sr-only">Medium</span>
              </Link>
              <Link
                href="https://t.me/qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="sr-only">Telegram</span>
              </Link>
              <Link
                href="https://linktr.ee/qwerydotxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.953 15.066l-.038.001c-.932 0-1.688-.757-1.688-1.69 0-.931.756-1.688 1.688-1.688h.038l1.323-.001v-.217l-3.263-3.262a1.689 1.689 0 0 1 0-2.388 1.688 1.688 0 0 1 2.387 0l3.263 3.262v-6.13a1.688 1.688 0 0 1 3.376 0v6.13l3.263-3.262a1.689 1.689 0 0 1 2.387 0 1.69 1.69 0 0 1 0 2.388l-3.262 3.262v.218h1.322c.932 0 1.689.756 1.689 1.688s-.757 1.69-1.689 1.69l-1.322-.001v1.326c0 .932-.757 1.688-1.688 1.688-.932 0-1.688-.756-1.688-1.688v-1.326h-.038c-.932 0-1.688-.757-1.688-1.69 0-.931.756-1.688 1.688-1.688h.038v-.217l-1.323.001v3.231a1.688 1.688 0 0 1-3.376 0v-3.231l-1.323-.001z" />
                </svg>
                <span className="sr-only">Linktree</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {showAbout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="relative w-full max-w-lg bg-black border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Logo and Title */}
            <div className="flex items-center gap-3 mb-6">
              <Image src="/cropped_circle_image.png" alt="Qwery" width={48} height={48} className="w-12 h-12" />
              <h2 className="font-mono text-2xl font-semibold text-white">qwery</h2>
            </div>

            {/* About Content */}
            <div className="space-y-4 text-gray-400">
              <p className="text-white font-medium text-lg">Architecting Solana's Developer Infrastructure</p>
              <p>
                Qwery provides modular SDKs, high-performance APIs, and x402 payment facilitation for Solana. We're
                building the foundation for the next generation of decentralized applications.
              </p>
              <p>
                Our mission is to make Solana development accessible, efficient, and powerful. With zero user fees and
                sub-2 second settlement, we're removing the barriers between developers and the blockchain.
              </p>
              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm">
                  <span className="text-white font-medium">Key Features:</span>
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Modular SDKs for TypeScript, Python, and Rust</li>
                  <li>• High-performance REST & WebSocket APIs</li>
                  <li>• x402 Payment Facilitation</li>
                  <li>• Zero user fees</li>
                  <li>• Sub-2 second settlement</li>
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <Link
                href="https://dashboard.qwery.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 text-white font-medium rounded-full transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: "#F29146" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
