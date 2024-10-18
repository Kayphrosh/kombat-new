import React from 'react'
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';
interface WithdrawFundModalProps {
  closeWithdrawalModal: () => void;
}
const WithdrawalModal: React.FC<WithdrawFundModalProps> = ({ closeWithdrawalModal }) => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="title">Fund Withdrawal</div>
        <div className="close-modal-btn" onClick={closeWithdrawalModal}>
          close
          <Image src={closeIcon} alt="Close modal" />
        </div>

        <input type="text" placeholder="Enter amount" />
      </div>
    </div>
  );
};

export default WithdrawalModal
