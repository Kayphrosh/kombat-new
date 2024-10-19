import React from 'react';
import moneyIcon from '@/assets/images/icons/money.svg';
import userAvatarImage from '@/assets/images/icons/avatar-2.png';
import cupIcon from '@/assets/images/icons/cup.svg';
import Image from 'next/image';
import vec from '@/assets/images/icons/vec.svg';
import buttonGreen from '@/assets/images/icons/button-green.svg';
import closeIcon from '@/assets/images/close.svg';
// import { useSelector } from 'react-redux';
// // import { RootState } from '@/firebase/store';

const WonModal = () => {
  const userName = 'Kendrick';
  const userAvatar = userAvatarImage;
  const amountDeposited = '$2,000';
  return (
    <div className="won-modal">
      <div className="won-modal-content">
        <div className="title">
          <h2>Congratulations, {userName}</h2>

          <div className="paragraph">
            <Image src={vec} alt="" style={{ transform: 'rotate(180deg)' }} />
            <span>
              <p>You have won the match</p>
              <Image src={moneyIcon} alt="" />
            </span>
            <Image src={vec} alt="" />
          </div>
        </div>
        <div className="close-btn">
          close
          <Image src={closeIcon} alt="" />
        </div>
        <div className="user-avatar">
          <Image src={userAvatar} alt="" />
          <Image id="cup-icon" src={cupIcon} alt="" />
        </div>

        <div className="amount-deposited">
          Total of {amountDeposited} has been deposited in your wallet
        </div>

        <div className="cta">
          <button>
            <Image src={buttonGreen} alt="" />
            <div> Withdraw</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WonModal;
