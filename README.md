# Simple ERC-20 Indexer

This is an app that uses the Alchemy SDK rigged to Alchemy's Enhanced APIs in order to display all of an address's ERC-20 token balances.

## Set Up

Environmental variables needed.   
In file `.env` and input   
`VITE_ALCHEMY_MAINNET_KEY` - Alchemy API key for ETH Mainnet  
`VITE_WC_PROJECT_ID` - WalletConnect project ID, it's free, can be acquired on WalletConnect website

1. Install dependencies by running `npm install`
2. Start application by running `npm run dev`

## Features

- Wallet integration  
- Indication of request in progress  
- Error handling  
- ENS support   
- Links to etherscan

## Live demo:
https://courageous-phoenix-3d8178.netlify.app/
