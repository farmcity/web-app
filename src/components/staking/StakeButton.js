'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  useStake, 
  useUnstake, 
  useClaimReward, 
  useWaitForStaking, 
  useStakedAmount, 
  useEarnedRewards,
  useStakingAddress 
} from '@/hooks/useStaking';
import { 
  useFarmCityBalance, 
  useFarmCityApprovalForAll,
  useFarmCitySetApprovalForAll,
  useWaitForMint
} from '@/hooks/useFarmCity';

export default function StakeButton({ tokenId, variant = 'default', className = '', onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(1);
  const [mode, setMode] = useState('stake'); // 'stake', 'unstake', 'claim'
  const [step, setStep] = useState('input'); // 'input', 'approve', 'pending', 'success', 'error'

  const { isConnected } = useAccount();
  const stakingAddress = useStakingAddress();
  
  // Data hooks
  const { data: balance } = useFarmCityBalance(tokenId);
  const { data: stakedAmount, refetch: refetchStaked } = useStakedAmount(tokenId);
  const { data: earnedRewards, refetch: refetchRewards } = useEarnedRewards(tokenId);
  
  // Approval hooks
  const { data: isApprovedForAll, refetch: refetchApproval } = useFarmCityApprovalForAll(stakingAddress);
  const { setApprovalForAll, hash: approvalHash, error: approvalError, isPending: isApproving } = useFarmCitySetApprovalForAll();
  
  // Transaction hooks
  const { stake, hash: stakeHash, error: stakeError, isPending: isStaking } = useStake();
  const { unstake, hash: unstakeHash, error: unstakeError, isPending: isUnstaking } = useUnstake();
  const { claimReward, hash: claimHash, error: claimError, isPending: isClaiming } = useClaimReward();
  
  // Wait for transaction confirmation
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } = useWaitForMint(approvalHash);
  const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = useWaitForStaking(stakeHash);
  const { isLoading: isUnstakeConfirming, isSuccess: isUnstakeSuccess } = useWaitForStaking(unstakeHash);
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForStaking(claimHash);

  const userBalance = balance ? Number(balance) : 0;
  const userStaked = stakedAmount ? Number(stakedAmount) : 0;
  const userRewards = earnedRewards ? parseFloat(earnedRewards) : 0;
  const availableToStake = userBalance - userStaked;
  const needsApproval = mode === 'stake' && !isApprovedForAll;

  // Handle approval success
  useEffect(() => {
    if (isApprovalSuccess && step === 'approve') {
      setStep('input');
      refetchApproval();
    }
  }, [isApprovalSuccess, step, refetchApproval]);

  // Handle transaction success
  useEffect(() => {
    if ((isStakeSuccess || isUnstakeSuccess || isClaimSuccess) && step === 'pending') {
      setStep('success');
      refetchStaked();
      refetchRewards();
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    }
  }, [isStakeSuccess, isUnstakeSuccess, isClaimSuccess, step, refetchStaked, refetchRewards, onSuccess]);

  // Handle transaction errors
  useEffect(() => {
    if ((stakeError || unstakeError || claimError || approvalError) && (step === 'pending' || step === 'approve')) {
      setStep('error');
    }
  }, [stakeError, unstakeError, claimError, approvalError, step]);

  const handleApprove = async () => {
    try {
      setStep('approve');
      await setApprovalForAll(stakingAddress, true);
    } catch (error) {
      console.error('Approval error:', error);
      setStep('error');
    }
  };

  const handleStake = async () => {
    try {
      // Check if approval is needed first
      if (needsApproval) {
        await handleApprove();
        return;
      }
      
      setStep('pending');
      await stake(tokenId, amount);
    } catch (error) {
      console.error('Stake error:', error);
      setStep('error');
    }
  };

  const handleUnstake = async () => {
    try {
      setStep('pending');
      await unstake(tokenId, amount);
    } catch (error) {
      console.error('Unstake error:', error);
      setStep('error');
    }
  };

  const handleClaim = async () => {
    try {
      setStep('pending');
      await claimReward(tokenId);
    } catch (error) {
      console.error('Claim error:', error);
      setStep('error');
    }
  };

  const resetModal = () => {
    setStep('input');
    setAmount(1);
    setMode('stake');
  };

  const openModal = (initialMode = 'stake') => {
    setMode(initialMode);
    setAmount(initialMode === 'stake' ? Math.min(1, availableToStake) : Math.min(1, userStaked));
    setIsModalOpen(true);
    resetModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModal();
  };

  if (!isConnected) {
    return null;
  }

  // Quick action buttons for different variants
  if (variant === 'quick-stake' && availableToStake > 0) {
    return (
      <button
        onClick={() => openModal('stake')}
        className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${className}`}
      >
        Stake ({availableToStake})
      </button>
    );
  }

  if (variant === 'quick-claim' && userRewards > 0) {
    return (
      <button
        onClick={() => openModal('claim')}
        className={`bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${className}`}
      >
        Claim ${userRewards.toFixed(2)}
      </button>
    );
  }

  // Default button - shows appropriate action based on state
  const getButtonText = () => {
    if (availableToStake > 0 && userStaked === 0) return 'Start Staking';
    if (availableToStake > 0) return 'Stake More';
    if (userStaked > 0) return 'Manage Stake';
    return 'No Tokens';
  };

  const isDisabled = userBalance === 0;

  return (
    <>
      <button
        onClick={() => openModal()}
        disabled={isDisabled}
        className={`bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
      >
        {getButtonText()}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {step === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {mode === 'stake' && 'Tokens Staked!'}
                  {mode === 'unstake' && 'Tokens Unstaked!'}
                  {mode === 'claim' && 'Rewards Claimed!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {mode === 'stake' && `Successfully staked ${amount} tokens`}
                  {mode === 'unstake' && `Successfully unstaked ${amount} tokens`}
                  {mode === 'claim' && 'Successfully claimed your rewards'}
                </p>
                <button
                  onClick={closeModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Done
                </button>
              </div>
            ) : step === 'error' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transaction Failed</h3>
                <p className="text-gray-600 mb-6">
                  {stakeError?.message || unstakeError?.message || claimError?.message || approvalError?.message || 'Something went wrong'}
                </p>
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={() => setStep('input')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {mode === 'stake' && 'Stake Tokens'}
                    {mode === 'unstake' && 'Unstake Tokens'}
                    {mode === 'claim' && 'Claim Rewards'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mode selector */}
                <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                  <button
                    onClick={() => setMode('stake')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === 'stake' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    disabled={availableToStake === 0}
                  >
                    Stake ({availableToStake})
                  </button>
                  <button
                    onClick={() => setMode('unstake')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === 'unstake' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    disabled={userStaked === 0}
                  >
                    Unstake ({userStaked})
                  </button>
                  <button
                    onClick={() => setMode('claim')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === 'claim' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    disabled={userRewards === 0}
                  >
                    Claim (${userRewards.toFixed(2)})
                  </button>
                </div>

                {/* Current state info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Balance:</span>
                      <span className="ml-2 font-medium">{userBalance} tokens</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Currently Staked:</span>
                      <span className="ml-2 font-medium">{userStaked} tokens</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Available to Stake:</span>
                      <span className="ml-2 font-medium">{availableToStake} tokens</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Pending Rewards:</span>
                      <span className="ml-2 font-medium">${userRewards.toFixed(4)} USDT</span>
                    </div>
                  </div>
                </div>

                {/* Amount input for stake/unstake */}
                {(mode === 'stake' || mode === 'unstake') && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to {mode}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="1"
                        max={mode === 'stake' ? availableToStake : userStaked}
                        value={amount}
                        onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        disabled={step === 'pending'}
                      />
                      <button
                        onClick={() => setAmount(mode === 'stake' ? availableToStake : userStaked)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                        disabled={step === 'pending'}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                )}

                {/* Claim rewards info */}
                {mode === 'claim' && userRewards > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      You will receive <strong>${userRewards.toFixed(4)} USDT</strong> as rewards.
                    </p>
                  </div>
                )}

                {/* Approval notice for staking */}
                {mode === 'stake' && needsApproval && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      <strong>📝 Approval Required:</strong> You need to approve the staking contract to transfer your tokens. This is a one-time approval for all your farm tokens.
                    </p>
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={mode === 'stake' ? handleStake : mode === 'unstake' ? handleUnstake : handleClaim}
                  disabled={
                    step === 'pending' || step === 'approve' ||
                    (mode === 'stake' && (amount > availableToStake || amount < 1)) ||
                    (mode === 'unstake' && (amount > userStaked || amount < 1)) ||
                    (mode === 'claim' && userRewards === 0)
                  }
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {(step === 'pending' || step === 'approve') ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isApproving || isApprovalConfirming ? 'Approving Contract...' :
                       isStaking || isStakeConfirming ? 'Staking...' : 
                       isUnstaking || isUnstakeConfirming ? 'Unstaking...' : 
                       isClaiming || isClaimConfirming ? 'Claiming...' : 'Processing...'}
                    </span>
                  ) : (
                    <>
                      {mode === 'stake' && needsApproval && 'Approve & Stake'}
                      {mode === 'stake' && !needsApproval && `Stake ${amount} Token${amount > 1 ? 's' : ''}`}
                      {mode === 'unstake' && `Unstake ${amount} Token${amount > 1 ? 's' : ''}`}
                      {mode === 'claim' && `Claim $${userRewards.toFixed(4)} USDT`}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}