'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, localhost, lisk } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'FarmCity',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID if needed
  chains: [localhost, hardhat, lisk],
  transports: {
    [localhost.id]: http(),
    [hardhat.id]: http(),
    [lisk.id]: http(),
  },
});

export const chains = [localhost, hardhat];