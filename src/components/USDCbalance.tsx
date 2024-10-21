import React from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';

interface USDCBalanceProps {
  walletAddress: string;
  onBalanceUpdate: (balance: number) => void;
}

const USDCBalance: React.FC<USDCBalanceProps> = ({
  walletAddress,
  onBalanceUpdate,
}) => {
  const { data, isError, isLoading } = useReadContract({
    address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5', // USDC contract address
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [walletAddress as `0x${string}`],
  });

  React.useEffect(() => {
    if (!isLoading && !isError && data) {
      const balance = BigInt(data.toString());
      const formattedBalance = parseFloat(formatUnits(balance, 6));
      onBalanceUpdate(formattedBalance);
    }
  }, [data, isError, isLoading, onBalanceUpdate]);

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error fetching balance</span>;

  const balance = data ? BigInt(data.toString()) : BigInt(0);
  const formattedBalance = formatUnits(balance, 18);
  return <span>${parseFloat(formattedBalance).toFixed(2)} USDC</span>;
};

export default USDCBalance;