'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMintPrice, useMintFarmCity, useWaitForMint, useFarmCityAddress } from '@/hooks/useFarmCity';
import { useUsdtBalance, useUsdtAllowance, useUsdtApprove, useWaitForUsdtTransaction } from '@/hooks/useUSDT';
import { useMarketplaceData } from '@/hooks/useMarketplace';
import PostMintStakingPrompt from '@/components/staking/PostMintStakingPrompt';

export default function MintTokens({ tokenId = 1, onSuccess, showFarmSelection = false }) {
  const [selectedFarmId, setSelectedFarmId] = useState(1); // Default to farm ID 1
  const [amount, setAmount] = useState(1);
  const [step, setStep] = useState('mint'); // 'mint', 'approve', 'approving', 'minting', 'success'
  const [showStakingPrompt, setShowStakingPrompt] = useState(false);
  
  const { address, isConnected } = useAccount();
  const farmCityAddress = useFarmCityAddress();
  
  // Get marketplace data for farm information
  const { farms, isLoading: farmsLoading } = useMarketplaceData();
  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms.find(f => f.id === 1) || farms[0];
  
  // FarmCity hooks
  const { data: mintPrice, isLoading: mintPriceLoading } = useMintPrice();
  const { mintTokens, hash: mintHash, error: mintError, isPending: isMinting } = useMintFarmCity();
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForMint(mintHash);
  
  // USDT hooks
  const { data: usdtBalance, refetch: refetchUsdtBalance } = useUsdtBalance();
  const { data: usdtAllowance, refetch: refetchAllowance } = useUsdtAllowance(farmCityAddress);
  const { approve, hash: approveHash, error: approveError, isPending: isApproving } = useUsdtApprove();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForUsdtTransaction(approveHash);

  // Calculate total cost
  const totalCost = mintPrice ? (parseFloat(mintPrice) * amount).toFixed(2) : '0';
  const hasEnoughBalance = usdtBalance ? parseFloat(usdtBalance) >= parseFloat(totalCost) : false;
  const hasEnoughAllowance = usdtAllowance ? parseFloat(usdtAllowance) >= parseFloat(totalCost) : false;

  // Handle approve success
  useEffect(() => {
    if (isApproveSuccess && step === 'approving') {
      setStep('mint');
      refetchAllowance();
    }
  }, [isApproveSuccess, step, refetchAllowance]);

  // Handle mint success
  useEffect(() => {
    if (isMintSuccess && step === 'minting') {
      setStep('success');
      setShowStakingPrompt(true);
      refetchUsdtBalance();
      // Call onSuccess callback if provided (for closing modal)
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000); // Close modal after 2 seconds
      }
    }
  }, [isMintSuccess, step, refetchUsdtBalance, onSuccess]);

  // Update selected farm when tokenId prop changes
  useEffect(() => {
    if (tokenId && tokenId !== selectedFarmId) {
      setSelectedFarmId(tokenId);
    }
  }, [tokenId, selectedFarmId]);

  const handleApprove = async () => {
    try {
      setStep('approving');
      await approve(farmCityAddress, totalCost);
    } catch (error) {
      console.error('Approve error:', error);
      setStep('approve');
    }
  };

  const handleMint = async () => {
    try {
      setStep('minting');
      await mintTokens(selectedFarmId, amount);
    } catch (error) {
      console.error('Mint error:', error);
      setStep('mint');
    }
  };

  const resetForm = () => {
    setStep('mint');
    setAmount(1);
    setShowStakingPrompt(false);
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Mint Farm Tokens</h3>
        <p className="text-gray-600 mb-6">Connect your wallet to mint farm tokens</p>
        <div className="text-center">
          <p className="text-gray-500">Please connect your wallet to continue</p>
        </div>
      </div>
    );
  }

  if (farmCityAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Mint Farm Tokens</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            FarmCity contract not deployed. Please deploy contracts first.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tokens Minted Successfully!</h3>
          <p className="text-gray-600 mb-6">
            You&apos;ve successfully minted {amount} {selectedFarm?.name || 'Farm'} token{amount > 1 ? 's' : ''}
          </p>
          <button
            onClick={resetForm}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Mint More Tokens
          </button>

          {/* Staking prompt after successful mint */}
          {showStakingPrompt && (
            <PostMintStakingPrompt
              tokenId={selectedFarmId}
              amount={amount}
              farmName={selectedFarm?.name || 'Farm'}
              onDismiss={() => setShowStakingPrompt(false)}
            />
          )}
        </div>
      </div>
    );
  }

  if (farmsLoading || !selectedFarm) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Mint Farm Tokens</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading farm data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="mint-token" className={`${onSuccess ? '' : 'bg-white rounded-2xl p-8 shadow-lg'}`}>
      {!onSuccess && <h3 className="text-2xl font-bold text-gray-900 mb-6">Mint Farm Tokens</h3>}
      
      {/* Farm Selection - Only show if requested */}
      {showFarmSelection && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Farm to Invest In
          </label>
          <div className="grid grid-cols-1 gap-3">
            {farms.map((farm) => (
              <div
                key={farm.id}
                onClick={() => setSelectedFarmId(farm.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFarmId === farm.id
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900">{farm.name}</h4>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span>APY: {farm.apy}%</span>
                      <span>Risk: {farm.riskLevel}</span>
                      <span>Harvest: {farm.harvestSeason}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-gray-900">Token ID: #{farm.id}</p>
                    <p className="text-gray-600">{farm.availableTokens.toLocaleString()} available</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected Farm Info */}
      {selectedFarm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Selected Farm:</span>
              <span className="ml-2 font-medium text-gray-900">{selectedFarm.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Price per token:</span>
              <span className="ml-2 font-medium text-gray-900">
                {mintPriceLoading ? 'Loading...' : `${mintPrice || '0'} USDT`}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Your USDT balance:</span>
              <span className="ml-2 font-medium text-gray-900">{usdtBalance || '0'} USDT</span>
            </div>
            <div>
              <span className="text-gray-500">Total cost:</span>
              <span className="ml-2 font-medium text-gray-900">{totalCost} USDT</span>
            </div>
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to mint
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={step === 'approving' || step === 'minting'}
        />
      </div>

      {/* Error Messages */}
      {!hasEnoughBalance && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">
            Insufficient USDT balance. You need {totalCost} USDT but only have {usdtBalance || '0'} USDT.
          </p>
        </div>
      )}

      {(mintError || approveError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">
            Transaction failed: {mintError?.message || approveError?.message}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {!hasEnoughAllowance && hasEnoughBalance && (
          <button
            onClick={handleApprove}
            disabled={isApproving || isApproveConfirming || !hasEnoughBalance}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isApproving || isApproveConfirming ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isApproving ? 'Approving...' : 'Confirming Approval...'}
              </span>
            ) : (
              `Approve ${totalCost} USDT`
            )}
          </button>
        )}

        <button
          onClick={handleMint}
          disabled={isMinting || isMintConfirming || !hasEnoughBalance || !hasEnoughAllowance}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isMinting || isMintConfirming ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isMinting ? 'Minting...' : 'Confirming Mint...'}
            </span>
          ) : (
            `Mint ${amount} Token${amount > 1 ? 's' : ''} for ${totalCost} USDT`
          )}
        </button>
      </div>
    </div>
  );
}