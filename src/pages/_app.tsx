// pages/_app.tsx
import '@/styles/globals.scss';
import '@/styles/main.scss';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from '@/chain';
import { FirestoreProvider } from '@/components/Firebasewrapper';
import { WagmiProvider } from 'wagmi';
import { useWagmiConfig } from '@/wagmi';
import { NEXT_PUBLIC_CDP_API_KEY } from '../config';
import { NextPage } from 'next';

const queryClient = new QueryClient();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const wagmiConfig = useWagmiConfig();
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Kombat</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="Kombat" />
      </Head>
      <WagmiProvider config={wagmiConfig}>
        <FirestoreProvider>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider
              apiKey={NEXT_PUBLIC_CDP_API_KEY}
              chain={baseSepolia}
            >
              <RainbowKitProvider modalSize="compact">
                {getLayout(<Component {...pageProps} />)}{' '}
                {/* Call getLayout here */}
              </RainbowKitProvider>
            </OnchainKitProvider>
          </QueryClientProvider>
        </FirestoreProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
