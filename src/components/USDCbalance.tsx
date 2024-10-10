import React from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

interface USDCBalanceProps {
  walletAddress: `0x${string}`;
}

const USDCBalance: React.FC<USDCBalanceProps> = ({ walletAddress }) => {
  const { data, isError, isLoading } = useReadContract({
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC contract address (Ethereum mainnet)
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [walletAddress],
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error fetching balance</span>;

  // Format balance (USDC has 6 decimals)
  const formattedBalance = data ? formatUnits(data, 6) : '0';

  return <span>${parseFloat(formattedBalance).toFixed(2)} USDC</span>;
};

export default USDCBalance;
