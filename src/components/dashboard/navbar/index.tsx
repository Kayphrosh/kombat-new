import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useDisconnect } from 'wagmi';
import FundWalletModal from '../fund-wallet-modal';
import userAvatar from '@/assets/images/icons/avatar-2.png';
import Image from 'next/image';
import Link from 'next/link';
import USDCBalance from '@/components/USDCbalance';
import menuIcon from '@/assets/images/icons/menu-icon.svg';
import notificationIcon from '@/assets/images/icons/notification.svg';
import { DropdownIcon, LogoIcon, NavLinkIcon, WalletIcon } from './svg';
import NotificationModal from '../notification-modal';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notificationModalRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (address?.startsWith('0x')) {
      setWalletAddress(address as `0x${string}`);
    }
  }, [address]);

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const handleNotificationModalToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleNotificationModalClickOutside = (event: MouseEvent) => {
      if (
        notificationModalRef.current &&
        !notificationModalRef.current.contains(event.target as Node)
      ) {
        setNotificationModalOpen(false);
      }
    };

    if (isNotificationModalOpen) {
      document.addEventListener(
        'mousedown',
        handleNotificationModalClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleNotificationModalClickOutside,
      );
    };
  }, [isNotificationModalOpen]);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationModalRef.current &&
        !notificationModalRef.current.contains(event.target as Node)
      ) {
        setNotificationModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <LogoIcon />

        <div className="nav-links">
          <Link
            href="/overview"
            className={router.pathname === '/overview' ? 'active' : ''}
          >
            <NavLinkIcon />
            Overview
          </Link>
          <Link
            href="/wallet"
            className={router.pathname === '/wallet' ? 'active' : ''}
          >
            <NavLinkIcon />
            Wallet
          </Link>
        </div>

        <div className="cta">
          {/* <Avatar
            address="0x21A5a01E50af8a55F2ABa73bD3CbCd4Ed09168dC"
            chain={baseSepolia}
          /> */}

          <div className="wallet-balance" onClick={() => setIsModalOpen(true)}>
            <WalletIcon />
            <span>
              {walletAddress ? (
                <USDCBalance
                  walletAddress={walletAddress}
                  onBalanceUpdate={(balance) => {}}
                />
              ) : (
                <p>Loading...</p>
              )}
            </span>
          </div>

          <div
            className="fund-wallet-btn"
            title="Notification"
            onClick={handleNotificationModalToggle}
          >
            <Image src={notificationIcon} alt="Notification" />
            <span>02</span>
          </div>

          <button
            className="profile-settings-dropdown"
            title="profile-settings"
            onClick={handleDropdownToggle}
          >
            <Image id="user-icon" src={userAvatar} alt="Profile" />
            <DropdownIcon />
          </button>

          <button
            className="menu-icon"
            title="menu"
            onClick={handleDropdownToggle}
          >
            <Image src={menuIcon} alt="Menu" />
          </button>
        </div>

        {isNotificationModalOpen && (
          <NotificationModal
            isOpen={isNotificationModalOpen}
            onClose={() => setNotificationModalOpen(false)}
          />
        )}

        {isDropdownOpen && (
          <div className="notification-modal">
            <div className="notification-modal-content">
              <div ref={dropdownRef} className="profile-settings-modal">
                <div className="nav-links-mobile">
                  <Link
                    href="/overview"
                    className={router.pathname === '/overview' ? 'active' : ''}
                  >
                    <NavLinkIcon />
                    Overview
                  </Link>
                  <Link
                    href="/wallet"
                    className={router.pathname === '/wallet' ? 'active' : ''}
                  >
                    <NavLinkIcon />
                    Wallet
                  </Link>
                </div>
                <button>Profile</button>
                <button>Support</button>
                {isConnected ? (
                  <button onClick={handleDisconnect}>Disconnect</button>
                ) : (
                  <button>Connect</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && <FundWalletModal closeModal={closeModal} />}
    </div>
  );
};

export default Navbar;
