import React, {useState} from 'react';
import Navbar from '../navbar';
import WalletHistory from './wallet-history';
import avatar from '@/assets/images/icons/profile-pics.svg';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Image from 'next/image';
import FundWalletModal from '../fund-wallet-modal';

const Walllet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  const userAvatar = '';
  const userName = 'Kendrick';
  const totalAmount = '12393';
  return (
    <div className="overview-container">
      <Navbar />

      <div className="wallet-content">
        <div className="wallet-balance-container">
          <div className="balance-container">
            <div className="title">
              <Image src={avatar} alt="" />
              Balance
            </div>

            <div className="amount">$ {totalAmount}</div>

            <div className="cta">
              <button className="fund-wallet" onClick={openModal}>
                Fund Wallet
              </button>

              <button className="withdraw">
                <div>Make Withdrawal</div>
                <Image src={buttonBg} alt="Button Background" />
              </button>
            </div>
          </div>
        </div>

        <div className="wallet-container">
          <div className="title">
            <h4>Wallet History</h4>
          </div>

          <WalletHistory />
        </div>
      </div>

      {isModalOpen && <FundWalletModal closeModal={closeModal} />}
    </div>
  );
};

export default Walllet;
