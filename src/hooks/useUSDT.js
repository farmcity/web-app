'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { USDT_ABI } from '@/lib/contracts';
import { useUsdtAddress } from '@/hooks/useFarmCity';

// Hook to read USDT balance
export function useUsdtBalance() {
  const { address } = useAccount();
  const usdtAddress = useUsdtAddress();

  const { data, ...rest } = useReadContract({
    address: usdtAddress,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address && usdtAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? formatUnits(data, 6) : '0', // Format from wei to USDT (6 decimals)
    raw: data,
    ...rest
  };
}

// Hook to read USDT allowance
export function useUsdtAllowance(spenderAddress) {
  const { address } = useAccount();
  const usdtAddress = useUsdtAddress();

  const { data, ...rest } = useReadContract({
    address: usdtAddress,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: [address, spenderAddress],
    enabled: !!address && !!spenderAddress && usdtAddress !== '0x0000000000000000000000000000000000000000',
  });

  return {
    data: data ? formatUnits(data, 6) : '0', // Format from wei to USDT (6 decimals)
    raw: data,
    ...rest
  };
}

// Hook to approve USDT spending
export function useUsdtApprove() {
  const usdtAddress = useUsdtAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const approve = async (spenderAddress, amount) => {
    if (!usdtAddress || usdtAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('USDT contract not available');
    }

    const parsedAmount = parseUnits(amount.toString(), 6);
    
    writeContract({
      address: usdtAddress,
      abi: USDT_ABI,
      functionName: 'approve',
      args: [spenderAddress, parsedAmount],
    });
  };

  return {
    approve,
    hash,
    error,
    isPending,
  };
}

// Hook to mint USDT (for testing purposes)
export function useUsdtMint() {
  const usdtAddress = useUsdtAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const mint = async (toAddress, amount) => {
    if (!usdtAddress || usdtAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('USDT contract not available');
    }

    const parsedAmount = parseUnits(amount.toString(), 6);
    
    writeContract({
      address: usdtAddress,
      abi: USDT_ABI,
      functionName: 'mint',
      args: [toAddress, parsedAmount],
    });
  };

  return {
    mint,
    hash,
    error,
    isPending,
  };
}

// Hook to wait for USDT transaction confirmation
export function useWaitForUsdtTransaction(hash) {
  return useWaitForTransactionReceipt({
    hash,
  });
}