'use client';

import { useUserPortfolio } from '@/hooks/usePortfolio';

// Hook for dashboard-specific data
export function useDashboardData() {
  const portfolio = useUserPortfolio();
  
  // Calculate total tokens owned across all farms
  const totalTokens = portfolio.portfolioData.reduce((sum, farm) => sum + farm.tokensOwned, 0);
  const uniqueTokenCount = portfolio.portfolioData.length;
  
  return {
    totalPortfolioValue: portfolio.totalValue,
    activeFarms: {
      totalTokens,
      uniqueTokenCount
    },
    totalYield: portfolio.totalYield, // Set to 0 in portfolio hook
    isLoading: portfolio.isLoading,
    isConnected: portfolio.isConnected,
    portfolioData: portfolio.portfolioData
  };
}

// Hook for recent activity (API placeholder)
export function useRecentActivity() {
  // This would normally fetch from an API endpoint
  // For now, return placeholder data that indicates API integration
  return {
    activities: [
      {
        id: 1,
        type: "api_placeholder",
        title: "Recent Activity",
        description: "Activity data will be loaded from API",
        timestamp: new Date().toISOString(),
        icon: "📊"
      }
    ],
    isLoading: false,
    error: null
  };
}

// Hook for top performing farms (API placeholder)
export function useTopPerformingFarms() {
  // This would normally fetch from an API endpoint
  // For now, return placeholder data that indicates API integration
  return {
    farms: [
      {
        id: 1,
        name: "Top Performing Farms",
        description: "Performance data will be loaded from API",
        icon: "📈"
      }
    ],
    isLoading: false,
    error: null
  };
}