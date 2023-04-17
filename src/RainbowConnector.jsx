import '@rainbow-me/rainbowkit/styles.css';
import './polyfills';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public'
import App from './App';

const { chains, provider } = configureChains(
    [mainnet], //, polygon, optimism, arbitrum 
    [
        alchemyProvider({apiKey: import.meta.env.VITE_ALCHEMY_MAINNET_KEY}),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'ERC20 Token Indexer',
    projectId: import.meta.env.VITE_WC_PROJECT_ID,
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

function RainbowConnector() {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
                <App />
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default RainbowConnector;