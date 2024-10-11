'use client';
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
import { baseSepolia } from 'viem/chains';
import { WagmiConfig } from 'wagmi'; // WagmiConfig instead of WagmiProvider
import { NEXT_PUBLIC_CDP_API_KEY } from '../config';
import { useWagmiConfig } from '@/wagmi'; // Import your custom hook

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const config = useWagmiConfig(); // Properly call the hook here

  return (
    <>
      <Head>
        <title>Kombat</title>
        <meta name="description" content="Kombat" />
      </Head>
      <WagmiConfig config={config}>
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
      </WagmiConfig>
    </>
  );
}

export default App;
