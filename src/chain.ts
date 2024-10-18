export const baseSepolia = {
  id: 11155111,
  name: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
};
