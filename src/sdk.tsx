import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

const wallet = new CoinbaseWalletSDK({
  appName: 'Your App Name',
  appLogoUrl: 'https://i.postimg.cc/SjjcBdqN/Group-3.png',
});

const connectWallet = async () => {
  const provider = wallet.makeWeb3Provider();
  const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
  console.log('Wallet Address:', accounts[0]);
};
