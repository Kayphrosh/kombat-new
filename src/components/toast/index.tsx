import React, { useState, useEffect } from 'react';
import balanceIcon from '@/assets/images/icons/balance-insufficient.svg';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';

interface ToastProps {
  message: string;
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [show, setShow] = useState(true);

  // Automatically close the toast after 1.5 minutes (90 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 90000); // 1.5 minutes in milliseconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  // Close button handler
  const handleClose = () => {
    setShow(false);
    onClose();
  };

  // If not showing, don't render the component
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

        <button className="close-button" onClick={handleClose}>
          <Image src={closeIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
