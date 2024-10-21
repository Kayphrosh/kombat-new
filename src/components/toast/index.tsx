import React, { useState, useEffect } from 'react';
import balanceIcon from '@/assets/images/icons/balance-insufficient.svg';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';

interface ToastProps {
  message: string;
  onClose: () => void;
}
const InsufficientFundToast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 90000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <div className="main">
          <Image src={balanceIcon} alt="" />
          <div className="desc">
            <h3>Insufficient funds </h3>
            <p>{message}</p>
          </div>
        </div>

        <button className="close-button" onClick={handleClose} title="Close">
          <Image src={closeIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default InsufficientFundToast;
