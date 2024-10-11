'use client';

import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
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
import StartKombatButton from '@/components/StartKombatBtn';

const Home: React.FC = () => {
  const { address } = useAccount();
  const router = useRouter();

  // Example: Fetch user info to determine if they are new or existing
  // This assumes you have an API or state that can help determine user status
  const isNewUser = true; // Replace this with actual logic to check if the user is new

  useEffect(() => {
    if (address) {
      // Redirect based on user status
      if (isNewUser) {
        router.push('/identity');
      } else {
        router.push('/overview');
      }
    }
  }, [address, isNewUser, router]);

  return (
    <div className="start-screen-container">
      <div className="start-screen-content">
        <div className="top-bar">
          <Image src={logo} alt="Logo" />
          <div className="cta">
            <SignupButton />
            <LoginButton />
          </div>
        </div>

        <main>
          <div className="text">
            <h2>Decentralised and Secure Bet for You and Friends</h2>
            <p>
              Experience decentralized, transparent betting where every
              challenge is fair, and funds are secured until the victor emerges.
            </p>
            <StartKombatButton />
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
            <Link href="https://x.com" passHref>
              <Image src={xIcon} alt="X Logo" />
            </Link>
            <Link href="https://instagram.com" passHref>
              <Image src={igIcon} alt="Instagram Logo" />
            </Link>
            <Link href="https://farcaster.com" passHref>
              <Image src={farcasterIcon} alt="Farcaster Logo" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
