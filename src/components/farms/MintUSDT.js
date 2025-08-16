'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUsdtAddress } from '@/hooks/useFarmCity';
import { useUsdtBalance, useUsdtMint, useWaitForUsdtTransaction } from '@/hooks/useUSDT';

export default function MintUSDT() {
  const [amount, setAmount] = useState('1000');
  const [isSuccess, setIsSuccess] = useState(false);

  const { address, isConnected } = useAccount();
  const usdtAddress = useUsdtAddress();

  // USDT hooks
  const { data: usdtBalance, refetch: refetchBalance } = useUsdtBalance();
  const { mint, hash, error, isPending } = useUsdtMint();
  const { isLoading: isConfirming, isSuccess: isTxSuccess } = useWaitForUsdtTransaction(hash);

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess) {
      setIsSuccess(true);
      refetchBalance();
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }
  }, [isTxSuccess, refetchBalance]);

  const handleMint = async () => {
    try {
      await mint(address, amount);
    } catch (error) {
      console.error('Mint USDT error:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Mint Test USDT</h3>
        <p className="text-gray-600">Connect your wallet to mint test USDT tokens</p>
      </div>
    );
  }

  if (usdtAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Mint Test USDT</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">MockUSDT contract not deployed. Please deploy contracts first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Mint Test USDT</h3>
        <div className="text-sm text-gray-500">Only for localhost testing</div>
      </div>

      {/* Current Balance */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-sm text-gray-500">Current USDT Balance</div>
        <div className="text-2xl font-bold text-gray-900">{usdtBalance || '0'} USDT</div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount to mint</label>
        <div className="relative">
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isPending || isConfirming}
            placeholder="Enter amount"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 text-sm">USDT</span>
          </div>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {['100', '500', '1000', '5000'].map((quickAmount) => (
          <button
            key={quickAmount}
            onClick={() => setAmount(quickAmount)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isPending || isConfirming}
          >
            {quickAmount}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">Transaction failed: {error.message}</p>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm">Successfully minted {amount} USDT!</p>
        </div>
      )}

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
      >
        {isPending || isConfirming ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {isPending ? 'Minting...' : 'Confirming...'}
          </span>
        ) : (
          `Mint ${amount} USDT`
        )}
      </button>

      {/* Warning */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-xs">⚠️ This is test USDT for localhost development only. Do not use on mainnet.</p>
      </div>
    </div>
  );
}
