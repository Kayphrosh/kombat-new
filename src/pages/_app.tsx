// 'use client';
import '@/styles/globals.scss';
import '@/styles/main.scss';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain } from 'viem/chains';
import { WagmiProvider } from 'wagmi'; // WagmiConfig instead of WagmiProvider
import { NEXT_PUBLIC_CDP_API_KEY } from '../config';
import { useWagmiConfig } from '@/wagmi'; // Import your custom hook
import { baseSepolia } from '@/chain';
const queryClient = new QueryClient();

// const baseSepolia: Chain = {
//   id: 84532,
//   name: 'Base Sepolia',
//   nativeCurrency: {
//     name: 'Sepolia Ether',
//     symbol: 'ETH',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: { http: ['https://sepolia.base.org'] },
//     public: { http: ['https://sepolia.base.org'] },
//   },
//   fees: {
//     // Make sure this is compatible with the Chain type from viem
//     baseFeeMultiplier: 1.2 as any,
//   },
//   // ... other properties ...
// };

function App({ Component, pageProps }: AppProps) {
  const wagmiConfig = useWagmiConfig();

  return (
    <>
      <Head>
        <title>Kombat</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <meta name="description" content="Kombat" />
      </Head>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={NEXT_PUBLIC_CDP_API_KEY}
            chain={baseSepolia}
          >
            <RainbowKitProvider modalSize="compact">
              <Component {...pageProps} />
            </RainbowKitProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
