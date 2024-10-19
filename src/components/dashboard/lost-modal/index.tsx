import React from 'react';
import lostCoin from '@/assets/images/icons/lost-coin.svg';
import userAvatarImage from '@/assets/images/icons/avatar-2.png';
import cupIcon from '@/assets/images/icons/cup.svg';
import Image from 'next/image';
import vec from '@/assets/images/icons/vec.svg';
import buttonGreen from '@/assets/images/icons/button-green.svg';
import closeIcon from '@/assets/images/close.svg';
import Link from 'next/link';
import {
  PlusIcon,
  ButtonBg,
} from '@/components/dashboard/overview/live-bets/svg';
// import { useSelector } from 'react-redux';
// // import { RootState } from '@/firebase/store';

const LostModal = () => {
  const userName = 'Kendrick';
  const userAvatar = userAvatarImage;
  const amountDeposited = '$2,000';
  return (
    <div className="won-modal">
      <div className="won-modal-content lost-modal-content">
        <div className="close-btn">
          close
          <Image src={closeIcon} alt="" />
        </div>

        <div className="user-avatar">
          <Image src={userAvatar} alt="" />
        </div>

        <Image id="lost-coin" src={lostCoin} alt="" />

        <div className="title">
          <h2>You lost the kombat, {userName}</h2>

          <div className="paragraph">
            <p>It’s fine, you can start another Kombat</p>
          </div>
        </div>

        <Link href="./new-kombat" id="new-kombat-btn">
          <button>
            <div className="btn-text">
              New Kombat
              <PlusIcon />
            </div>
            <div className="bg">
              <ButtonBg />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LostModal;
