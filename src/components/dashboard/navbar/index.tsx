import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useDisconnect } from 'wagmi';
import FundWalletModal from '../fund-wallet-modal';
import logo from '@/assets/images/logo.svg';
import overview from '@/assets/images/icons/overview.svg';
import dropDown from '@/assets/images/icons/drop-down.svg';
import balanceIcon from '@/assets/images/icons/balance.svg';
import userAvatar from '@/assets/images/icons/avatar-2.png';
import Image from 'next/image';
import Link from 'next/link';
import USDCBalance from '@/components/USDCbalance';
import menuIcon from '@/assets/images/icons/menu-icon.svg';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        // Replace this with your actual method to get the wallet address
        // For now, we'll use the address from useAccount
        if (address && address.startsWith('0x')) {
          setWalletAddress(address as `0x${string}`);

          // console.log('address', address)
        }
      } catch (error) {
        console.error('Error fetching wallet address:', error);
      }
    };

    fetchWalletAddress();
  }, [address]);

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const handleDropdownToggle = () => {
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <Image src={logo} alt="Logo" />

        <div className="nav-links">
          <Link
            href="/overview"
            className={router.pathname === '/overview' ? 'active' : ''}
          >
            <Image src={overview} alt="Overview" />
            Overview
          </Link>
          <Link
            href="/wallet"
            className={router.pathname === '/wallet' ? 'active' : ''}
          >
            <Image src={overview} alt="Wallet" />
            Wallet
          </Link>
        </div>

        <div className="cta">
          <div className="wallet-balance">
            <Image src={balanceIcon} alt="Balance" />
            <span>
              {walletAddress ? (
                <USDCBalance 
                  walletAddress={walletAddress} 
                  onBalanceUpdate={(balance) => {/* Handle balance update */}}
                />
              ) : (
                <p>Fetching wallet address...</p>
              )}
            </span>
          </div>
          <button className="fund-wallet-btn" onClick={openModal}>
            Fund
          </button>
          <button
            className="profile-settings-dropdown"
            title="profile-settings"
            onClick={handleDropdownToggle}
          >
            <Image id="user-icon" src={userAvatar} alt="Profile" />
            <Image id="drop-down" src={dropDown} alt="Dropdown" />
          </button>
          <button className="menu-icon">
            <Image src={menuIcon} alt="Menu" />
          </button>
        </div>

        {isDropdownOpen && (
          <div ref={dropdownRef} className="profile-settings-modal">
            <button>Profile</button>
            <button>Support</button>
            {isConnected ? (
              <button onClick={handleDisconnect}>Disconnect</button>
            ) : (
              <button>Connect</button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && <FundWalletModal closeModal={closeModal} />}
    </div>
  );
};

export default Navbar;
