"use client";

import Navbar from "@/components/layout/Navbar";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import { useUserPortfolio } from "@/hooks/usePortfolio";
import { useAccount } from 'wagmi';

export default function Portfolio() {
  const { isConnected } = useAccount();
  const {
    portfolioData,
    totalValue,
    totalInvested,
    totalYield,
    totalGains,
    totalGainsPercent,
    isLoading
  } = useUserPortfolio();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your portfolio...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
              <p className="text-gray-600">Please connect your wallet to view your farm portfolio</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-700 mt-2">Track your farm investments and ERC1155 token holdings</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">${totalInvested.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gains</p>
                <p className={`text-2xl font-bold ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalGains >= 0 ? '+' : ''}${totalGains.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${totalGains >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{totalGains >= 0 ? '📈' : '📉'}</span>
              </div>
            </div>
            <p className={`text-sm mt-2 ${totalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGains >= 0 ? '+' : ''}{totalGainsPercent}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yield Earned</p>
                <p className="text-2xl font-bold text-yellow-600">${totalYield.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Holdings</p>
                <p className="text-2xl font-bold text-purple-600">{portfolioData.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-2">Active Farms</p>
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Your Farm Holdings</h2>
            <p className="text-gray-600 text-sm mt-1">ERC1155 tokens representing farm ownership shares</p>
          </div>
          <div className="p-6">
            {portfolioData.length > 0 ? (
              <div className="space-y-4">
                {portfolioData.map((holding) => (
                  <PortfolioCard key={holding.id} holding={holding} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Farm Holdings Yet</h3>
                <p className="text-gray-600 mb-4">You haven't invested in any farms yet. Visit the marketplace to start building your portfolio.</p>
                <a
                  href="/marketplace"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Farms
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Portfolio Performance</h2>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-600">Portfolio performance chart</p>
                <p className="text-sm text-gray-500 mt-2">Coming soon: Interactive charts and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}