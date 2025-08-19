'use client';

import { useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

// Hook to get network information and contract addresses
export function useNetwork() {
  const chainId = useChainId();
  
  // Map chain IDs to network names
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1337: // Hardhat localhost
        return 'localhost';
      case 31337: // Ganache localhost
        return 'localhost';
      case 4202: // Lisk Sepolia testnet
        return 'sepolia';
      case 1135: // Lisk mainnet
        return 'lisk';
      default:
        return 'localhost'; // Fallback to localhost
    }
  };
  
  const network = getNetworkName(chainId);
  const addresses = CONTRACT_ADDRESSES[network] || CONTRACT_ADDRESSES.localhost;
  
  return {
    chainId,
    network,
    addresses,
    isSupported: !!CONTRACT_ADDRESSES[network],
    farmCityAddress: addresses.FARM_CITY,
    usdtAddress: addresses.USDT,
    stakingAddress: addresses.FARM_CITY_STAKING
  };
}

// Hook to check if current network is supported
export function useIsSupportedNetwork() {
  const { isSupported } = useNetwork();
  return isSupported;
}