'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { FARM_CITY_ABI } from '@/lib/contracts';
import { useNetwork } from '@/hooks/useNetwork';

// Hook to get the FarmCity contract address for current network
export function useFarmCityAddress() {
  const { farmCityAddress } = useNetwork();
  return farmCityAddress;
}

// Hook to read FarmCity token balance
export function useFarmCityBalance(tokenId = 1) {
  const { address } = useAccount();
  const farmCityAddress = useFarmCityAddress();

  return useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'balanceOf',
    args: [address, tokenId],
    enabled: !!address && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
}

// Hook to read mint price
export function useMintPrice() {
  const farmCityAddress = useFarmCityAddress();

  const { data, ...rest } = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'mintPrice',
    enabled: farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? formatUnits(data, 6) : null, // Format from wei to USDT (6 decimals)
    raw: data,
    ...rest
  };
}

// Hook to get the USDT contract address for current network
export function useUsdtAddress() {
  const { usdtAddress } = useNetwork();
  return usdtAddress;
}

// Hook to read USDT token address from FarmCity contract
export function useUsdtTokenAddress() {
  const farmCityAddress = useFarmCityAddress();

  return useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'usdtToken',
    enabled: farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
}

// Hook to mint FarmCity tokens
export function useMintFarmCity() {
  const farmCityAddress = useFarmCityAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const mintTokens = async (tokenId, amount) => {
    if (!farmCityAddress || farmCityAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('FarmCity contract not deployed');
    }

    writeContract({
      address: farmCityAddress,
      abi: FARM_CITY_ABI,
      functionName: 'mintPublic',
      args: [tokenId, amount, '0x'], // Empty bytes for data parameter
    });
  };

  return {
    mintTokens,
    hash,
    error,
    isPending,
  };
}

// Hook to wait for mint transaction confirmation
export function useWaitForMint(hash) {
  return useWaitForTransactionReceipt({
    hash,
  });
}

// Hook to get total supply for a specific token ID
export function useTotalSupply(tokenId) {
  const farmCityAddress = useFarmCityAddress();

  const { data, ...rest } = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'totalSupply',
    args: [tokenId],
    enabled: !!tokenId && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? Number(data) : 0,
    raw: data,
    ...rest
  };
}

// Hook to get total supply across all token IDs
export function useTotalSupplyAll() {
  const farmCityAddress = useFarmCityAddress();

  const { data, ...rest } = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'totalSupply',
    args: [], // No args for the overloaded version
    enabled: farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? Number(data) : 0,
    raw: data,
    ...rest
  };
}

// Hook to check if tokens exist for a given ID
export function useTokenExists(tokenId) {
  const farmCityAddress = useFarmCityAddress();

  return useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'exists',
    args: [tokenId],
    enabled: !!tokenId && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
}

// Hook to get supply data for multiple token IDs
export function useMultipleTokenSupply(tokenIds = []) {
  const farmCityAddress = useFarmCityAddress();
  
  // Call hooks at the top level for each possible tokenId
  const token1Supply = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'totalSupply',
    args: [tokenIds[0]],
    enabled: !!tokenIds[0] && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
  
  const token2Supply = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'totalSupply',
    args: [tokenIds[1]],
    enabled: !!tokenIds[1] && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
  
  const token3Supply = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'totalSupply',
    args: [tokenIds[2]],
    enabled: !!tokenIds[2] && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });

  // Map the results back to the expected format
  const allSupplies = [token1Supply, token2Supply, token3Supply];
  
  return tokenIds.map((tokenId, index) => {
    const supply = allSupplies[index];
    return {
      tokenId,
      totalSupply: supply?.data ? Number(supply.data) : 0,
      isLoading: supply?.isLoading || false,
      error: supply?.error
    };
  }).filter((_, index) => index < tokenIds.length);
}

// Hook to get max supply for a specific token ID
export function useMaxSupply(tokenId) {
  const farmCityAddress = useFarmCityAddress();

  const { data, ...rest } = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'maxSupplyPerToken',
    args: [tokenId],
    enabled: !!tokenId && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? Number(data) : 0,
    raw: data,
    ...rest
  };
}

// Hook to get max supply for multiple token IDs
export function useMultipleMaxSupply(tokenIds = []) {
  const farmCityAddress = useFarmCityAddress();
  
  // Call hooks at the top level for each possible tokenId
  const token1MaxSupply = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'maxSupplyPerToken',
    args: [tokenIds[0]],
    enabled: !!tokenIds[0] && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
  
  const token2MaxSupply = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'maxSupplyPerToken',
    args: [tokenIds[1]],
    enabled: !!tokenIds[1] && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });
  
  const token3MaxSupply = useReadContract({
    address: farmCityAddress,
    abi: FARM_CITY_ABI,
    functionName: 'maxSupplyPerToken',
    args: [tokenIds[2]],
    enabled: !!tokenIds[2] && farmCityAddress !== '0x0000000000000000000000000000000000000000',
  });

  // Map the results back to the expected format
  const allMaxSupplies = [token1MaxSupply, token2MaxSupply, token3MaxSupply];
  
  return tokenIds.map((tokenId, index) => {
    const maxSupply = allMaxSupplies[index];
    return {
      tokenId,
      maxSupply: maxSupply?.data ? Number(maxSupply.data) : 0,
      isLoading: maxSupply?.isLoading || false,
      error: maxSupply?.error
    };
  }).filter((_, index) => index < tokenIds.length);
}