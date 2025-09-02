'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, localhost, lisk, liskSepolia } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'FarmCity',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID if needed
  chains: [
    ...(process.env.NODE_ENV === 'development' ? [localhost, hardhat,] : []),
    liskSepolia, lisk],
  transports: {
    ...(process.env.NODE_ENV === 'development' ? {
      [localhost.id]: http(),
      [hardhat.id]: http()
    } : {}),
    [liskSepolia.id]: http(),
    [lisk.id]: http(),
  },
});

export const chains = [localhost, hardhat];