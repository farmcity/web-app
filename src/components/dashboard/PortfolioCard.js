"use client";

import { useState } from "react";
import Link from "next/link";
import { useStakedAmount, useEarnedRewards } from "@/hooks/useStaking";
import StakeButton from "@/components/staking/StakeButton";

export default function PortfolioCard({ holding }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get staking data for this token
  const { data: stakedAmount } = useStakedAmount(holding.id);
  const { data: earnedRewards } = useEarnedRewards(holding.id);
  
  const userStaked = stakedAmount ? Number(stakedAmount) : 0;
  const userRewards = earnedRewards ? parseFloat(earnedRewards) : 0;
  const unstakedTokens = holding.tokensOwned - userStaked;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Growing': return 'text-blue-600 bg-blue-100';
      case 'Harvesting': return 'text-yellow-600 bg-yellow-100';
      case 'Dormant': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const gainLoss = holding.currentValue - holding.purchaseValue;
  const gainLossPercent = ((gainLoss / holding.purchaseValue) * 100).toFixed(2);
  const isPositive = gainLoss >= 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{holding.farmName}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(holding.status)}`}>
              {holding.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(holding.riskLevel)}`}>
              {holding.riskLevel} Risk
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>🌾 {holding.cropType}</p>
            <p>📍 {holding.location}</p>
            <p>🔗 Token ID: {holding.tokenId}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ${holding.currentValue.toLocaleString()}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}${Math.abs(gainLoss).toLocaleString()} ({isPositive ? '+' : ''}{gainLossPercent}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <span className="text-xs text-gray-500">Tokens Owned</span>
          <p className="font-semibold text-gray-900">{holding.tokensOwned}</p>
          <div className="text-xs text-gray-500 mt-1">
            <span className="text-purple-600 font-medium">{userStaked} staked</span>
            {unstakedTokens > 0 && (
              <span className="text-amber-600 font-medium ml-2">{unstakedTokens} unstaked</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500">Purchase Value</span>
          <p className="font-semibold text-gray-900">${holding.purchaseValue.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Staking Rewards</span>
          <p className="font-semibold text-yellow-600">${userRewards.toFixed(4)}</p>
          <div className="text-xs text-gray-500 mt-1">USDT earned</div>
        </div>
        <div>
          <span className="text-xs text-gray-500">APY</span>
          <p className="font-semibold text-green-600">{holding.apy}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Next Harvest:</span> {formatDate(holding.nextHarvest)}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
          
          {/* Show quick staking actions */}
          {unstakedTokens > 0 && (
            <StakeButton 
              tokenId={holding.id}
              variant="quick-stake"
              className="text-xs"
            />
          )}
          
          {userRewards > 0 && (
            <StakeButton 
              tokenId={holding.id}
              variant="quick-claim"
              className="text-xs"
            />
          )}
          
          <StakeButton 
            tokenId={holding.id}
            variant="default"
            className="text-sm px-3 py-1"
          />
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Investment Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Investment:</span>
                  <span className="font-medium">${holding.purchaseValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-medium">${holding.currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Yield:</span>
                  <span className="font-medium text-yellow-600">${holding.yieldEarned.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Staking Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tokens Staked:</span>
                  <span className="font-medium text-purple-600">{userStaked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tokens Unstaked:</span>
                  <span className="font-medium text-amber-600">{unstakedTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rewards Earned:</span>
                  <span className="font-medium text-yellow-600">${userRewards.toFixed(4)} USDT</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Token Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract Type:</span>
                  <span className="font-medium">ERC1155</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Token Standard:</span>
                  <span className="font-medium">Multi-Token</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transferable:</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Your ERC1155 tokens represent fractional ownership of this farm. 
              You can trade, transfer, or hold them to earn harvest yields.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}