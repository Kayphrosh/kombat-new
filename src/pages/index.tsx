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
import SignupButtonMobile from '@/components/SignUpBtnMobile';
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
          <div className="cta cta-mobile">
            <SignupButtonMobile />
          </div>
        </div>
        {/* <svg
          width="553"
          height="668"
          viewBox="0 0 553 668"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1865_332607)">
            <path
              d="M0 19.8718C0 8.89693 8.89692 0 19.8718 0H533.128C544.103 0 553 8.89692 553 19.8718V648.128C553 659.103 544.103 668 533.128 668H19.8718C8.8969 668 0 659.103 0 648.128V19.8718Z"
              fill="#0A0D15"
            />
            <g filter="url(#filter0_bi_1865_332607)">
              <path
                d="M30.4781 11.1339C37.2706 4.02283 46.6764 0 56.5103 0H496.672C506.875 0 516.6 4.33003 523.427 11.9134L532.851 22.3814L543.755 34.4938C549.707 41.1047 553 49.6851 553 58.5804V609.42C553 618.315 549.707 626.895 543.755 633.506L523.427 656.087C516.6 663.67 506.875 668 496.672 668H56.5103C46.6764 668 37.2706 663.977 30.4781 656.866L9.96776 635.394C3.57002 628.696 0 619.79 0 610.528V57.4721C0 48.2098 3.57003 39.3038 9.96778 32.606L30.4781 11.1339Z"
                fill="#0A0D15"
                fill-opacity="0.8"
              />
              <path
                d="M56.5103 0.440135H496.672C506.751 0.440135 516.356 4.71723 523.1 12.2079L532.524 22.6759L543.428 34.7882C549.307 41.3184 552.56 49.7938 552.56 58.5804V609.42C552.56 618.206 549.307 626.682 543.428 633.212L523.1 655.792C516.356 663.283 506.751 667.56 496.672 667.56H56.5103C46.7966 667.56 37.5058 663.586 30.7963 656.562L10.286 635.09C3.96651 628.474 0.440135 619.677 0.440135 610.528V57.4721C0.440135 48.323 3.96652 39.5259 10.2861 32.91L30.7963 11.4379C37.5058 4.41378 46.7966 0.440135 56.5103 0.440135Z"
                stroke="white"
                stroke-opacity="0.15"
                stroke-width="0.88027"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_bi_1865_332607"
              x="-20"
              y="-20"
              width="593"
              height="708"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_1865_332607"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_backgroundBlur_1865_332607"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="21.1265" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.13 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect2_innerShadow_1865_332607"
              />
            </filter>
            <clipPath id="clip0_1865_332607">
              <path
                d="M0 19.8718C0 8.89693 8.89692 0 19.8718 0H533.128C544.103 0 553 8.89692 553 19.8718V648.128C553 659.103 544.103 668 533.128 668H19.8718C8.8969 668 0 659.103 0 648.128V19.8718Z"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg> */}

        <main>
          <div className="text">
            <h2>Decentralised and secure wager platform</h2>
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
