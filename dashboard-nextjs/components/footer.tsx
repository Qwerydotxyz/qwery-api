"use client"

import Image from "next/image"
import Link from "next/link"
import { Twitter, Github, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-6 lg:px-12 py-8 md:py-10">
        <div className="flex items-center gap-2 mb-6 md:mb-8 animate-fade-in-up">
          <Image src="/cropped_circle_image.png" alt="Qwery Logo" width={40} height={40} className="w-10 h-10" />
          <span className="font-mono text-lg font-semibold text-gray-900">qwery</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
          {/* Product Column */}
          <div className="animate-fade-in-up animation-delay-100">
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Website
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.npmjs.com/package/@qwery/sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  npm Package
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/documentation"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Qwery API
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation#x402"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  x402 Facilitator
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Qwerydotxyz/qwery-sdk-ts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  SDK (TypeScript)
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Qwerydotxyz/qwery-sdk-rust"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  SDK (Rust)
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="animate-fade-in-up animation-delay-300">
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/documentation"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.com/invite/qwerydotxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:support@qwery.xyz"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="font-semibold text-sm mb-4 text-gray-900">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="https://medium.com/@qwerydotxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-[#F29146] transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">Careers - Soon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-6 border-t border-gray-200 animate-fade-in-up animation-delay-500">
          {/* Terms and Privacy - Centered */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-600 hover:text-[#F29146] transition-colors duration-300">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-[#F29146] transition-colors duration-300"
            >
              Privacy
            </Link>
          </div>

          {/* Copyright - Centered */}
          <p className="text-sm text-gray-600 text-center">© 2025 Qwery. All rights reserved.</p>

          {/* Social Icons - Centered */}
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/qwerydotxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com/Qwerydotxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://discord.com/invite/qwerydotxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              aria-label="Discord"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </Link>
            <Link
              href="https://www.youtube.com/@qwerydotxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </Link>
            <Link
              href="https://medium.com/@qwerydotxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#F29146] transition-all duration-300 hover:scale-110"
              aria-label="Medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
