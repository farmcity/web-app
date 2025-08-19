'use client';

import { useState } from 'react';
import { useUserStakingData } from '@/hooks/useStaking';

export default function UnstakedTokensAlert({ onStakeClick, className = '' }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { unstakedTokens, hasUnstakedTokens, isLoading } = useUserStakingData();

  // Don't render if loading, no unstaked tokens, or dismissed
  if (isLoading || !hasUnstakedTokens || isDismissed) {
    return null;
  }

  const farmNames = {
    1: 'Poultry Farms',
    2: 'Shrimp Farms', 
    3: 'Coconut Plantations',
  };

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900 mb-1">
              You have unstaked farm tokens
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Start earning USDT rewards by staking your tokens! You have {unstakedTokens.length} farm{unstakedTokens.length > 1 ? 's' : ''} with unstaked tokens:
            </p>
            
            {/* List of unstaked tokens */}
            <div className="space-y-2 mb-4">
              {unstakedTokens.map(token => (
                <div key={token.tokenId} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {farmNames[token.tokenId] || `Farm ${token.tokenId}`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {token.balance} token{token.balance > 1 ? 's' : ''} ready to stake
                    </p>
                  </div>
                  <button
                    onClick={() => onStakeClick && onStakeClick(token.tokenId)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Stake Now
                  </button>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onStakeClick && onStakeClick('all')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Stake All Tokens
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-amber-700 hover:text-amber-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 ml-4 text-amber-400 hover:text-amber-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}