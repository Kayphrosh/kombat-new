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
    address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [walletAddress],
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error fetching balance</span>;

  // Ensure data is a valid bigint or convert it
  const balance = data ? BigInt(data.toString()) : BigInt(0);

  // Format balance (USDC has 6 decimals)
  const formattedBalance = formatUnits(balance, 6);

  return <span>${parseFloat(formattedBalance).toFixed(2)} USDC</span>;
};

export default USDCBalance;
