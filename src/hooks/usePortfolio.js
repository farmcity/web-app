'use client';

import { useAccount } from 'wagmi';
import { useFarmCityBalance, useMintPrice } from '@/hooks/useFarmCity';
import { useStakedAmount } from '@/hooks/useStaking';

// Hook to get user's portfolio data from smart contracts
export function useUserPortfolio() {
  const { address } = useAccount();
  const { data: mintPrice } = useMintPrice();
  
  // Define token IDs and farm metadata
  const tokenIds = [1, 2, 3];
  const farmMetadata = {
    1: {
      farmName: "Chicken Farms",
      cropType: "Closed House Poultry",
      location: "Indonesia",
      apy: 15,
      nextHarvest: "2025-10-01",
      status: "Active",
      riskLevel: "Low"
    },
    2: {
      farmName: "Shrimp Farms",
      cropType: "Vannamei Shrimp",
      location: "Indonesia",
      apy: 28.3,
      nextHarvest: "2025-12-31",
      status: "Active",
      riskLevel: "High"
    },
    3: {
      farmName: "Coconut Plantations",
      cropType: "Coconut to Copra Production",
      location: "Indonsesia",
      apy: 16.8,
      nextHarvest: "2026-03-01",
      status: "Initializing",
      riskLevel: "Medium"
    },
    
  };

  // Get balances and staked amounts for each token ID
  const balances = {
    1: useFarmCityBalance(1),
    2: useFarmCityBalance(2),
    3: useFarmCityBalance(3),
  };

  const stakedAmounts = {
    1: useStakedAmount(1),
    2: useStakedAmount(2),
    3: useStakedAmount(3),
  };

  // Check if any data is still loading
  const isAnyLoading = Object.values(balances).some(balance => balance.isLoading) || 
                      Object.values(stakedAmounts).some(staked => staked.isLoading) || 
                      !mintPrice;

  // Create portfolio data from contract balances
  const portfolioData = tokenIds
    .map(tokenId => {
      const balance = balances[tokenId];
      const stakedAmount = stakedAmounts[tokenId];
      const metadata = farmMetadata[tokenId];
      
      // Calculate total tokens owned (unstaked + staked)
      const unstakedTokens = balance.data ? Number(balance.data) : 0;
      const stakedTokens = stakedAmount.data ? Number(stakedAmount.data) : 0;
      const tokensOwned = unstakedTokens + stakedTokens;
      
      // Only include tokens the user actually owns
      if (tokensOwned === 0) return null;

      const pricePerToken = mintPrice || 300; // Fallback to 300 if not loaded
      const currentValue = tokensOwned * pricePerToken;
      const purchaseValue = currentValue; // Since we don't track historical prices, use current
      
      return {
        id: tokenId,
        tokenId: `0x${tokenId.toString().padStart(16, '0')}`, // Format as hex
        tokensOwned,
        currentValue,
        purchaseValue,
        // Set gains and yields to 0 as requested
        yieldEarned: 0,
        ...metadata
      };
    })
    .filter(Boolean); // Remove null entries

  // Calculate totals
  const totalValue = portfolioData.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvested = portfolioData.reduce((sum, item) => sum + item.purchaseValue, 0);
  const totalYield = 0; // Set to 0 as requested
  const totalGains = 0; // Set to 0 as requested
  const totalGainsPercent = 0; // Set to 0 as requested

  return {
    portfolioData,
    totalValue,
    totalInvested,
    totalYield,
    totalGains,
    totalGainsPercent,
    isLoading: isAnyLoading,
    isConnected: !!address
  };
}

// Hook to get portfolio summary stats
export function usePortfolioSummary() {
  const portfolio = useUserPortfolio();
  
  return {
    totalHoldings: portfolio.portfolioData.length,
    totalValue: portfolio.totalValue,
    totalInvested: portfolio.totalInvested,
    totalGains: portfolio.totalGains,
    totalGainsPercent: portfolio.totalGainsPercent,
    totalYield: portfolio.totalYield,
    isLoading: portfolio.isLoading,
    isConnected: portfolio.isConnected
  };
}