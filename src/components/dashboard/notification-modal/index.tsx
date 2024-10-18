import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CloseIcon from '@/assets/images/close.svg';
import userAvatar from '@/assets/images/icons/avatar-2.png';
import ArrowIcon from '@/assets/images/icons/arrow-.svg';
const NotificationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="notification-modal">
      <div className="notification-modal-content" ref={modalRef}>
        <main>
          <div className="title">
            <h3>Notifications</h3>
            <button title="Close" onClick={onClose}>
              <Image src={CloseIcon} alt="Close" />
            </button>
          </div>

          <div className="notifications-list">
            <div className="notification-item">
              <Image
                className="challenger-image"
                src={userAvatar}
                alt="Challenger"
              />
              <div className="notification-details">
                <h4>@grammyboyy invited you</h4>
                <p>Notification 1 description</p>
              </div>
              <div className="amount">$100</div>
              <div className="arrow-right">
                <Image src={ArrowIcon} alt="" />
              </div>
            </div>

            <div className="notification-item">
              <Image
                className="challenger-image"
                src={userAvatar}
                alt="Challenger"
              />
              <div className="notification-details">
                <h4>@grammyboyy invited you</h4>
                <p>Notification 1 description</p>
              </div>
              <div className="amount">$100</div>
              <div className="arrow-right">
                <Image src={ArrowIcon} alt="" />
              </div>
            </div>

            <div className="notification-item">
              <Image
                className="challenger-image"
                src={userAvatar}
                alt="Challenger"
              />
              <div className="notification-details">
                <h4>@grammyboyy invited you</h4>
                <p>Notification 1 description</p>
              </div>
              <div className="amount">$100</div>

              <div className="arrow-right">
                <Image src={ArrowIcon} alt="" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationModal;
