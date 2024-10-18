'use client';
import WalletWrapper from './WalletWrapper';

export default function SignupButtonMobile() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink bg-slate-200 text-[#030712] hover:bg-slate-300"
      text="Connect Wallet"
      withWalletAggregator={true}
    />
  );
}
