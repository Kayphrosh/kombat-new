'use client';
import '@/styles/globals.scss';
import '@/styles/main.scss';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import React, { useState } from 'react';
import Head from 'next/head';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { base, baseSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { NEXT_PUBLIC_CDP_API_KEY } from '../config';
import { getConfig } from '@/wagmi';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <Head>
        <title>Kombat</title>
        <meta name="description" content="Kombat" />
      </Head>
      <WagmiProvider config={config}>
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
