"use client";

import Navbar from "@/components/layout/Navbar";
import FarmCard from "@/components/farms/FarmCard";
import MintUSDT from "@/components/farms/MintUSDT";
import { useMarketplaceData } from "@/hooks/useMarketplace";
import { useChainId } from "wagmi";

export default function Marketplace() {
  // Get real data from smart contracts
  const { farms, statistics, isLoading, mintPrice } = useMarketplaceData();
  
  // Get current chain information
  const chainId = useChainId();
  
  // Check if current network is local, hardhat, or sepolia
  const isDevNetwork = chainId && (
    chainId === 31337 || // Hardhat local
    chainId === 1337 ||  // Ganache local  
    chainId === 11155111 // Sepolia testnet
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading marketplace data...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Farm Marketplace</h1>
          <p className="text-gray-700 mt-2">Discover and invest in verified real-world farms</p>
        </div>

        {/* Filters */}
        {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Types</option>
                <option>Chicken</option>
                <option>Shrimp</option>
                <option>Coconut</option>
                <option>Rice</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">APY Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All APY</option>
                <option>0-10%</option>
                <option>10-15%</option>
                <option>15-20%</option>
                <option>20%+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Risk Levels</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Locations</option>
                <option>Kentucky</option>
                <option>Louisiana</option>
                <option>Florida</option>
                <option>Arkansas</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.totalFarms}</div>
            <div className="text-sm text-gray-700 font-medium">Available Farms</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.averageAPY}%</div>
            <div className="text-sm text-gray-700 font-medium">Avg APY</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {statistics.totalTokensAvailable.toLocaleString()}
            </div>
            <div className="text-sm text-gray-700 font-medium">Tokens Available</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${(statistics.totalMarketValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-700 font-medium">Total Value</div>
          </div>
        </div>

        {/* Testing Components for Development - Only show on dev networks */}
        {isDevNetwork && (
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-800 font-medium">Development Mode</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                You&apos;re connected to a development network (Hardhat). Mock USDT minting is available for testing.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <MintUSDT />
            </div>
          </div>
        )}

        {/* Farm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard 
              key={farm.id} 
              farm={farm} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}