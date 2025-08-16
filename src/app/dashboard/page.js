"use client";

import Navbar from "@/components/layout/Navbar";
import { useDashboardData, useRecentActivity, useTopPerformingFarms } from "@/hooks/useDashboard";
import { useAccount } from 'wagmi';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const {
    totalPortfolioValue,
    activeFarms,
    totalYield,
    isLoading
  } = useDashboardData();
  
  const { activities } = useRecentActivity();
  const { farms: topFarms } = useTopPerformingFarms();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading dashboard...</p>
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
              <p className="text-gray-600">Please connect your wallet to view your dashboard</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-700 mt-2">Monitor your farm investments and track performance</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalPortfolioValue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Owned Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{activeFarms.totalTokens}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚜</span>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-blue-600 text-sm font-medium">{activeFarms.uniqueTokenCount} unique token types</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Yield</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalYield.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Top Performing Farms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Feed</h3>
                {/* <p className="text-gray-600 mb-4">Recent activity data will be loaded from API</p> */}
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  {/* <p className="font-medium">API Integration Ready</p>
                  <p>Connect to activity endpoint for real-time updates</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Farms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Top Performing Farms</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
                {/* <p className="text-gray-600 mb-4">Farm performance data will be loaded from API</p> */}
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  {/* <p className="font-medium">API Integration Ready</p>
                  <p>Connect to analytics endpoint for performance metrics</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}