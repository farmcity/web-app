'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { FARM_CITY_STAKING_ABI } from '@/lib/contracts';
import { useNetwork } from '@/hooks/useNetwork';
import { useFarmCityBalance } from '@/hooks/useFarmCity';

// Hook to get the staking contract address for current network
export function useStakingAddress() {
  const { stakingAddress } = useNetwork();
  return stakingAddress;
}

// Hook to get staked amount for a specific token ID
export function useStakedAmount(tokenId) {
  const { address } = useAccount();
  const stakingAddress = useStakingAddress();

  return useReadContract({
    address: stakingAddress,
    abi: FARM_CITY_STAKING_ABI,
    functionName: 'getStakedAmount',
    args: [address, tokenId],
    enabled: !!address && !!tokenId && stakingAddress !== '0x0000000000000000000000000000000000000000',
  });
}

// Hook to get earned rewards for a specific token ID
export function useEarnedRewards(tokenId) {
  const { address } = useAccount();
  const stakingAddress = useStakingAddress();

  const { data, ...rest } = useReadContract({
    address: stakingAddress,
    abi: FARM_CITY_STAKING_ABI,
    functionName: 'earned',
    args: [address, tokenId],
    enabled: !!address && !!tokenId && stakingAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? formatUnits(data, 6) : '0', // Format from wei to USDT (6 decimals)
    raw: data,
    ...rest
  };
}

// Hook to get total staked amount for a token ID (across all users)
export function useTotalStaked(tokenId) {
  const stakingAddress = useStakingAddress();

  return useReadContract({
    address: stakingAddress,
    abi: FARM_CITY_STAKING_ABI,
    functionName: 'getTotalStaked',
    args: [tokenId],
    enabled: !!tokenId && stakingAddress !== '0x0000000000000000000000000000000000000000',
  });
}

// Hook to get reward rate for a token ID
export function useRewardRate(tokenId) {
  const stakingAddress = useStakingAddress();

  const { data, ...rest } = useReadContract({
    address: stakingAddress,
    abi: FARM_CITY_STAKING_ABI,
    functionName: 'getRewardRate',
    args: [tokenId],
    enabled: !!tokenId && stakingAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? formatUnits(data, 6) : '0', // Format from wei to USDT (6 decimals)
    raw: data,
    ...rest
  };
}

// Hook to get reward finish time for a token ID
export function useRewardFinishTime(tokenId) {
  const stakingAddress = useStakingAddress();

  return useReadContract({
    address: stakingAddress,
    abi: FARM_CITY_STAKING_ABI,
    functionName: 'getRewardFinishTime',
    args: [tokenId],
    enabled: !!tokenId && stakingAddress !== '0x0000000000000000000000000000000000000000',
  });
}

// Hook to stake tokens
export function useStake() {
  const stakingAddress = useStakingAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const stake = async (tokenId, amount) => {
    if (!stakingAddress || stakingAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Staking contract not deployed');
    }

    writeContract({
      address: stakingAddress,
      abi: FARM_CITY_STAKING_ABI,
      functionName: 'stake',
      args: [tokenId, amount],
    });
  };

  return {
    stake,
    hash,
    error,
    isPending,
  };
}

// Hook to unstake tokens
export function useUnstake() {
  const stakingAddress = useStakingAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const unstake = async (tokenId, amount) => {
    if (!stakingAddress || stakingAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Staking contract not deployed');
    }

    writeContract({
      address: stakingAddress,
      abi: FARM_CITY_STAKING_ABI,
      functionName: 'unstake',
      args: [tokenId, amount],
    });
  };

  return {
    unstake,
    hash,
    error,
    isPending,
  };
}

// Hook to claim rewards for a single token ID
export function useClaimReward() {
  const stakingAddress = useStakingAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const claimReward = async (tokenId) => {
    if (!stakingAddress || stakingAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Staking contract not deployed');
    }

    writeContract({
      address: stakingAddress,
      abi: FARM_CITY_STAKING_ABI,
      functionName: 'claimReward',
      args: [tokenId],
    });
  };

  return {
    claimReward,
    hash,
    error,
    isPending,
  };
}

// Hook to claim rewards for multiple token IDs
export function useClaimRewards() {
  const stakingAddress = useStakingAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const claimRewards = async (tokenIds) => {
    if (!stakingAddress || stakingAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Staking contract not deployed');
    }

    writeContract({
      address: stakingAddress,
      abi: FARM_CITY_STAKING_ABI,
      functionName: 'claimRewards',
      args: [tokenIds],
    });
  };

  return {
    claimRewards,
    hash,
    error,
    isPending,
  };
}

// Hook to exit (unstake all and claim rewards) for a token ID
export function useExit() {
  const stakingAddress = useStakingAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const exit = async (tokenId) => {
    if (!stakingAddress || stakingAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Staking contract not deployed');
    }

    writeContract({
      address: stakingAddress,
      abi: FARM_CITY_STAKING_ABI,
      functionName: 'exit',
      args: [tokenId],
    });
  };

  return {
    exit,
    hash,
    error,
    isPending,
  };
}

// Hook to wait for staking transaction confirmation
export function useWaitForStaking(hash) {
  return useWaitForTransactionReceipt({
    hash,
  });
}

// Hook to get comprehensive staking data for a user
export function useUserStakingData() {
  const { address } = useAccount();
  const tokenIds = [1, 2, 3]; // Match portfolio hook token IDs

  // Get staking data for each token ID
  const stakingData = tokenIds.map(tokenId => {
    const stakedAmount = useStakedAmount(tokenId);
    const earnedRewards = useEarnedRewards(tokenId);
    const balance = useFarmCityBalance(tokenId);
    
    return {
      tokenId,
      stakedAmount: stakedAmount.data ? Number(stakedAmount.data) : 0,
      earnedRewards: earnedRewards.data ? parseFloat(earnedRewards.data) : 0,
      balance: balance.data ? Number(balance.data) : 0,
      isLoading: stakedAmount.isLoading || earnedRewards.isLoading || balance.isLoading,
      error: stakedAmount.error || earnedRewards.error || balance.error
    };
  });

  // Calculate totals
  const totalStaked = stakingData.reduce((sum, data) => sum + data.stakedAmount, 0);
  const totalRewards = stakingData.reduce((sum, data) => sum + data.earnedRewards, 0);
  const totalUnstaked = stakingData.reduce((sum, data) => sum + (data.balance - data.stakedAmount), 0);
  const isAnyLoading = stakingData.some(data => data.isLoading);

  // Find tokens that are unstaked (have balance but no stake)
  const unstakedTokens = stakingData.filter(data => 
    data.balance > 0 && data.stakedAmount === 0
  );

  return {
    stakingData: stakingData.filter(data => data.balance > 0), // Only return tokens user owns
    totalStaked,
    totalRewards,
    totalUnstaked,
    unstakedTokens,
    hasUnstakedTokens: unstakedTokens.length > 0,
    isLoading: isAnyLoading,
    isConnected: !!address
  };
}

// Hook to get staking overview for dashboard
export function useStakingOverview() {
  const userData = useUserStakingData();
  const tokenIds = [1, 2, 3]; // Match portfolio hook token IDs
  
  // Get pool data for all tokens
  const poolData = tokenIds.map(tokenId => {
    const totalStaked = useTotalStaked(tokenId);
    const rewardRate = useRewardRate(tokenId);
    
    return {
      tokenId,
      totalStaked: totalStaked.data ? Number(totalStaked.data) : 0,
      rewardRate: rewardRate.data ? parseFloat(rewardRate.data) : 0,
      isLoading: totalStaked.isLoading || rewardRate.isLoading
    };
  });

  const isPoolDataLoading = poolData.some(data => data.isLoading);

  return {
    ...userData,
    poolData,
    isPoolDataLoading
  };
}