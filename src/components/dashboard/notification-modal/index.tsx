import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CloseIcon from '@/assets/images/close.svg';
import vsIcon from '@/assets/images/icons/vs.svg'; // Default icon if no avatar is available
import ArrowIcon from '@/assets/images/icons/arrow-.svg';
import noNotification from '@/assets/images/icons/no-notification.svg';
// import { BetData, useFirestore } from '@/components/Firebasewrapper';
import { createPublicClient, http, parseAbi, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import defaultAvatar from '@/assets/images/icons/default-avatar.svg';

type BetData = Array<{
  _betId?: bigint | undefined;
  actor1?: `0x${string}` | undefined;
  actor2?: `0x${string}` | undefined;
  betName?: string | undefined;
  duration?: BigInt | undefined;
  startTimeStamp?: BigInt | undefined;
  creator?: `0x${string}` | undefined;
  betToken?: `0x${string}` | undefined;
  betAmount?: BigInt | undefined;
}>;

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange: (count: number) => void;
  newBets: BetData;
  usernames: { [key: string]: string };
  avatars: { [key: string]: string };
  loading: boolean;
}
const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNotificationCountChange,
  newBets,
  usernames,
  avatars,
  loading,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);



   useEffect(() => {
     onNotificationCountChange(newBets?.length || 0);
   }, [newBets, onNotificationCountChange]);

   // Effect for click outside handling
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (
         modalRef.current &&
         !modalRef.current.contains(event.target as Node)
       ) {
         onClose();
       }
     };

     if (isOpen) {
       document.addEventListener('mousedown', handleClickOutside);
     }

     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   const renderNotificationContent = () => {
     if (loading) {
       return (
         <div className="loading-spinner">
           <p>Loading...</p>
         </div>
       );
     }

     if (!newBets || newBets.length === 0) {
       return (
         <div className="empty-state">
           <Image
             src={noNotification}
             alt="No notifications"
             width={100}
             height={100}
           />
           <p>No notifications available</p>
         </div>
       );
     }

     return newBets.map((bet) => (
       <Link
         key={bet._betId?.toString()}
         href={`/invitation/${bet._betId}`}
         className="notification-item-link"
       >
         <div className="notification-item">
           <Image
             className="challenger-image"
             src={avatars[bet.creator!] || defaultAvatar}
             alt="Challenger"
             width={42}
             height={42}
           />
           <div className="notification-details">
             <h4>@{usernames[bet.creator!] || bet.creator?.slice(0, 6)} invited you</h4>
             <p>{bet.betName}</p>
           </div>
           <div className="amount">
             ${bet.betAmount ? Math.floor(Number(bet.betAmount) / 1e18) : 0}
           </div>
           <div className="arrow-right">
             <Image src={ArrowIcon} alt="View details" width={24} height={24} />
           </div>
         </div>
       </Link>
     ));
   };

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
          <div className="notifications-list">{renderNotificationContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default NotificationModal;
