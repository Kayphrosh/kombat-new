'use client';

import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/images/logo.svg';
import homeIllustration from '@/assets/images/home-illustration.png';
import homeIllustration2 from '@/assets/images/home-illustration-2.svg';
import xIcon from '@/assets/images/icons/x.svg';
import igIcon from '@/assets/images/icons/ig.svg';
import farcasterIcon from '@/assets/images/icons/farcaster.svg';

import LoginButton from '@/components/LoginBtn';
import SignupButton from '@/components/SignUpBtn';
import SignupButtonMobile from '@/components/SignUpBtnMobile';
import StartKombatButton from '@/components/StartKombatBtn';
import { useFirestore } from '@/components/Firebasewrapper';
import MarketBtn from '@/components/MarktBtn';

const Home: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { checkUserExists } = useFirestore();
  const router = useRouter();

  const handleStartKombatClick = async () => {
    if (isConnected) {
      const userExists = await checkUserExists(address as string);
      if (userExists) {
        router.push('/overview');
      } else {
        router.push('/identity');
      }
    } else {
      connect({ connector: connectors[0] });
    }
  };

  const handleMarketClick = () => {
    if (isConnected) {
      const checkUser = async () => {
        const userExists = await checkUserExists(address as string);
        if (userExists) {
          router.push('/markets');
        }
      };
      checkUser();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div className="start-screen-container">
      <div className="start-screen-content">
        <div className="top-bar">
          <Image src={logo} alt="Logo" />
          <div className="cta">
            <LoginButton />
          </div>
          <div className="cta cta-mobile">
            <SignupButtonMobile />
          </div>
        </div>

        <main>
          <div className="text">
            <h2>Decentralised and secure wager platform</h2>
            <p>
              Experience decentralized, transparent betting where every
              challenge is fair, and funds are secured until the victor emerges.
            </p>
            <div className="main-cta">
              <StartKombatButton onClick={handleStartKombatClick} />
              <MarketBtn onClick={handleMarketClick} />
            </div>
          </div>

          <div className="steps">
            <Image src={homeIllustration} alt="Home Illustration" />
          </div>

          <div className="home-illustration-2">
            <Image src={homeIllustration2} alt="Home Illustration 2" />
          </div>
        </main>

        <div className="join-community">
          <div className="title">Join Community</div>
          <div className="sm-links">
            <Link href="https://x.com/kombatxyz" passHref>
              <Image src={xIcon} alt="X Logo" />
            </Link>
            {/* <Link href="https://instagram.com" passHref>
              <Image src={igIcon} alt="Instagram Logo" />
            </Link> */}
            <Link href="https://warpcast.com/kombatxyz" passHref>
              <Image src={farcasterIcon} alt="Farcaster Logo" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
