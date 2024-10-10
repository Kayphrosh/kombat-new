'use client';
import WalletWrapper from './WalletWrapper';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Image from 'next/image';
import { dumpState } from 'viem/actions';
export default function StartKombatButton() {
  return (
    <button title="start Kombat">
      <WalletWrapper  className='btn-custom' text="Start Kombat" />
      <div id='text'>Start Kombat</div>
      <Image src={buttonBg} alt="Button Background" />
    </button>
  );
}
