'use client';
import WalletWrapper from './WalletWrapper';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Image from 'next/image';
import { dumpState } from 'viem/actions';

type StartKombatButtonProps = {
  onClick: () => void;
};
const MarketBtn: React.FC<StartKombatButtonProps> = ({ onClick }) => {
  return (
    <button className="market-btn" title="Market" onClick={onClick}>
      <WalletWrapper
        className="btn-custom"
        text=""
        withWalletAggregator={true}
      />
      Market
    </button>
  );
};

export default MarketBtn;
