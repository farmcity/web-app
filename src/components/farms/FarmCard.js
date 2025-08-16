'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useFarmCityBalance } from '@/hooks/useFarmCity';
import MintTokens from './MintTokens';

export default function FarmCard({ farm }) {
  const [showMintModal, setShowMintModal] = useState(false);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'High':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Farm Image */}
      <div className="relative h-24 bg-gradient-to-br from-green-400 to-green-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {farm.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">✓ Verified</span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(farm.riskLevel)}`}>{farm.riskLevel} Risk</span>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-lg">{farm.name}</h3>
          {/* <p className="text-sm opacity-90">📍 {farm.location}</p> */}
        </div>
      </div>

      {/* Farm Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-gray-600">APY</span>
            <p className="font-bold text-2xl text-green-600">~{farm.apy}%</p>
            {/* <span className="text-sm text-gray-600">Crop Type</span>
            <p className="font-semibold text-gray-900">{farm.cropType}</p> */}
          </div>
          <div className="text-right"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Token Price</span>
            <p className="font-semibold text-gray-900">{formatCurrency(farm.pricePerToken)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Available</span>
            <p className="font-semibold text-gray-900">{farm.availableTokens} tokens</p>
          </div>
        </div>

        {/* Minted Token Count */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Total Minted</span>
            <p className="font-semibold text-gray-900">
              {farm.isLoading ? <span className="animate-pulse">Loading...</span> : `${farm.totalMinted || 0} tokens`}
            </p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Ownership %</span>
            <p className="font-semibold text-gray-900">{farm.totalMinted ? `${((farm.totalMinted / 1000) * 100).toFixed(1)}%` : '0%'}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Minting Progress</span>
            <span className="font-medium">{farm.totalMinted || 0} / 1000 tokens</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${farm.totalMinted ? (farm.totalMinted / 1000) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{farm.totalMinted ? ((farm.totalMinted / 1000) * 100).toFixed(1) : 0}% minted</p>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p>🌾 Harvest: {farm.harvestSeason}</p>
          {/* <p>🗺️ GPS: {farm.coordinates}</p> */}
        </div>

        {/* Investment Actions */}
        <div className="flex space-x-2">
          {/* <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button> */}
          <button
            onClick={() => setShowMintModal(true)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Invest Now
          </button>
        </div>

        {/* Expandable Details */}
        {/* {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Farm Statistics</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Soil Quality</span>
                  <p className="font-medium">Excellent</p>
                </div>
                <div>
                  <span className="text-gray-600">Water Source</span>
                  <p className="font-medium">Irrigation</p>
                </div>
                <div>
                  <span className="text-gray-600">Farm Size</span>
                  <p className="font-medium">250 acres</p>
                </div>
                <div>
                  <span className="text-gray-600">Est. Founded</span>
                  <p className="font-medium">1998</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recent Activity</h4>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">• Planting completed - 2 weeks ago</p>
                <p className="text-gray-600">• Soil testing passed - 1 month ago</p>
                <p className="text-gray-600">• Weather monitoring active</p>
              </div>
            </div>

            <Link 
              href={`/farms/${farm.id}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors"
            >
              View Full Farm Profile
            </Link>
          </div>
        )} */}
      </div>

      {/* Mint Modal - Rendered outside the FarmCard container */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Invest in {farm.name}</h2>
              <button onClick={() => setShowMintModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                ×
              </button>
            </div>
            <div className="p-6">
              <MintTokens tokenId={farm.id} onSuccess={() => setShowMintModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
