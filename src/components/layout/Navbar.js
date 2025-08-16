"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="font-bold text-xl text-gray-900">FarmCity</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Marketplace
            </Link>
            <Link href="/portfolio" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Portfolio
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Docs
            </Link>
          </div>

          {/* Desktop Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/marketplace" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/portfolio" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                href="/docs" 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>
              
              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-gray-100 mt-4 flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}