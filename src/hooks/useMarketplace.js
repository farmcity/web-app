'use client';

import { useMultipleTokenSupply, useTotalSupplyAll, useMintPrice, useMultipleMaxSupply } from '@/hooks/useFarmCity';

// Hook to get marketplace data from smart contracts
export function useMarketplaceData() {
  // Define token IDs and farm metadata
  const tokenIds = [1, 2, 3];
  const tokenSupplyData = useMultipleTokenSupply(tokenIds);
  const maxSupplyData = useMultipleMaxSupply(tokenIds);
  const { data: totalSupplyAll } = useTotalSupplyAll();
  const { data: mintPrice } = useMintPrice();

  // Static farm metadata (in real app, this could come from IPFS or database)
  const farmMetadata = {
    1: {
      name: 'Chicken Farm',
      // location: "Kentucky, USA",
      // cropType: "Free-Range Chicken",
      apy: 15,
      harvestSeason: 'Bimonthly',
      riskLevel: 'Low',
      // image: "/api/placeholder/300/200",
      verified: true,
      // coordinates: "37.8393° N, 84.2700° W",
      // description: "Premium free-range chicken farm with organic feed and humane practices"
    },
    2: {
      name: 'Shrimp Farm',
      // location: "Louisiana, USA",
      // cropType: "Premium Shrimp",
      apy: 25,
      harvestSeason: 'Every 4 months',
      riskLevel: 'Medium',
      // image: "/api/placeholder/300/200",
      verified: true,
      // coordinates: "29.9511° N, 90.0715° W",
      // description: "Sustainable coastal shrimp aquaculture with advanced filtration systems"
    },
    3: {
      name: 'Coconut Copra Plantation',
      // location: "Florida, USA",
      // cropType: "Organic Coconuts",
      apy: 21,
      harvestSeason: 'Every month',
      riskLevel: 'Low',
      // image: "/api/placeholder/300/200",
      verified: true,
      // coordinates: "25.7617° N, 80.1918° W",
      // description: "Established coconut plantation with multiple product streams including oil and water"
    },
    // 4: {
    //   name: "Heritage Rice Paddies",
    //   location: "Arkansas, USA",
    //   cropType: "Premium Rice",
    //   apy: 0,
    //   harvestSeason: "Fall 2024",
    //   riskLevel: "Low",
    //   image: "/api/placeholder/300/200",
    //   verified: true,
    //   coordinates: "34.7465° N, 92.2896° W",
    //   description: "Traditional rice farming with modern irrigation and sustainable practices"
    // }
  };

  // Check if any data is still loading
  const isAnyLoading = tokenSupplyData.some((item) => item.isLoading) || maxSupplyData.some((item) => item.isLoading) || !mintPrice;

  // Merge static metadata with live contract data
  const farms = tokenIds
    .map((tokenId) => {
      const supplyInfo = tokenSupplyData.find((item) => item.tokenId === tokenId);
      const maxSupplyInfo = maxSupplyData.find((item) => item.tokenId === tokenId);
      const metadata = farmMetadata[tokenId];

      if (!metadata) return null;

      const totalMinted = supplyInfo?.totalSupply || 0;
      const maxSupply = maxSupplyInfo?.maxSupply || 10000; // Use contract data or fallback
      const availableTokens = Math.max(0, maxSupply - totalMinted);
      const pricePerToken = mintPrice || 300; // Fallback to 300 if not loaded

      return {
        id: tokenId,
        ...metadata,
        // Real contract data
        pricePerToken,
        totalMinted,
        availableTokens,
        maxSupply,
        totalValue: pricePerToken * maxSupply,
        isLoading: supplyInfo?.isLoading || false,
      };
    })
    .filter(Boolean);

  // Calculate marketplace statistics
  const totalFarms = farms.length;
  const totalTokensAvailable = farms.reduce((sum, farm) => sum + farm.availableTokens, 0);
  const totalMarketValue = farms.reduce((sum, farm) => sum + farm.totalValue, 0);
  const averageAPY = farms.length > 0 ? parseFloat((farms.reduce((sum, f) => sum + f.apy, 0) / farms.length).toFixed(2)) : 0;

  return {
    farms,
    statistics: {
      totalFarms,
      averageAPY,
      totalTokensAvailable,
      totalMarketValue,
      totalSupplyAll,
    },
    isLoading: isAnyLoading,
    mintPrice,
  };
}

// Hook to get individual farm data
export function useFarmData(tokenId) {
  const { farms, isLoading } = useMarketplaceData();
  const farm = farms.find((f) => f.id === tokenId);

  return {
    farm,
    isLoading,
    exists: !!farm,
  };
}
