import React from 'react';
import plusIcon from '@/assets/images/icons/plus.svg';
import vsIcon from '@/assets/images/icons/vs.svg';
import blankAvatar from '@/assets/images/icons/blank.png';
import userAvatar from '@/assets/images/icons/you.png';
import NewKombatBtnBg from '@/assets/images/icons/new-kombat-btn-bg.svg';
import Navbar from '../navbar';
import Image from 'next/image';
import Link from 'next/link';

const StartNewCombat = () => {
  const userName = 'Kayphrosh';
  return (
    <div className="start-new-combat-container new-combat-container">
      <Navbar />

      <div className="new-kombat-content">
        <div className="title">
          <h3>You’re welcome to the arena, @{userName}</h3>
          <p>Click the button bellow to start a kombat</p>
        </div>

        <Link href="./new-kombat">
          <button>
            <div className="btn-text">
              New Kombat
              <Image src={plusIcon} alt="" />
            </div>

            <div className="bg">
              <Image src={NewKombatBtnBg} alt="" />
            </div>
          </button>
        </Link>

        <div className="avatars-container">
          <div className="avatar">
            <Image src={userAvatar} alt="" />
          </div>

          <div className="vs">
            VS
            <Image src={vsIcon} alt="" />
          </div>
          <div className="avatar">
            <Image src={blankAvatar} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartNewCombat;
