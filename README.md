# FarmCity Web Application

FarmCity Web app for marketplace, and staking FCITY token.

## Getting Started

### Contract Configuration

After deploying contracts with hardhat, update the contract addresses in `src/lib/contracts.js`:

```javascript
export const CONTRACT_ADDRESSES = {
  sepholia: {
    FARM_CITY: "0x...", // Your deployed FarmCity address
    USDT: "0x...", // Your deployed USDT address
  }
};
```

## Web3 Integration

### Smart Contract Interactions

**FarmCity Contract:**
- `mintPublic()` - Mint farm tokens with USDT payment
- `balanceOf()` - Check token balance
- `mintPrice()` - Get current mint price

**MockUSDT Contract (Development and Testnet Only):**
- `mint()` - Mint test USDT tokens
- `approve()` - Approve USDT spending
- `balanceOf()` - Check USDT balance

### Key Components

**MintTokens Component** (`src/components/farms/MintTokens.js`):
- Handle USDT approval and farm token minting
- Real-time balance and transaction status
- Error handling and user feedback

**MintUSDT Component** (`src/components/farms/MintUSDT.js`):
- Mint test USDT for localhost development
- Quick amount buttons for convenience
- Balance tracking and transaction confirmation


## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── farms/          # Farm-related components
│   │   ├── FarmCard.js
│   │   ├── MintTokens.js
│   │   └── MintUSDT.js
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks for Web3
│   ├── useFarmCity.js
│   └── useUSDT.js
└── lib/                # Configuration and utilities
    ├── contracts.js    # Contract ABIs and addresses
    └── wagmi.js       # Wagmi configuration
```

## Environment Setup

The application is configured for localhost development by default. For other networks:

1. Update chain configuration in `src/lib/wagmi.js`
2. Update contract addresses in `src/lib/contracts.js`
3. Ensure your wallet is connected to the correct network

## Original Next.js Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.