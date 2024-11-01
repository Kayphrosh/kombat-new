import React from 'react';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';
import { useAccount } from 'wagmi';
interface WithdrawFundModalProps {
  closeWithdrawalModal: () => void;
}
const WithdrawalModal: React.FC<WithdrawFundModalProps> = ({
  closeWithdrawalModal,
}) => {
  const { address } = useAccount();

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="title">Withdraw Fund</div>

        <p>You can only withdraw USDC BASE SEPOLIA</p>

        <div className="withdrawal-form">
          <div className="withdrawal-input">
            <label htmlFor="">Enter Address</label>
            <input type="text" placeholder="Enter address" />
          </div>

          <div className="withdrawal-input">
            <label htmlFor="">Enter amount</label>
            <input type="text" placeholder="Enter amount" />
          </div>
        </div>

        <div className="close-modal-btn" onClick={closeWithdrawalModal}>
          close
          <Image src={closeIcon} alt="Close modal" />
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;
