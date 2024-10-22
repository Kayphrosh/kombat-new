import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useDisconnect } from 'wagmi';
import FundWalletModal from '../fund-wallet-modal';
import Image from 'next/image';
import Link from 'next/link';
import USDCBalance from '@/components/USDCbalance';
import menuIcon from '@/assets/images/icons/menu-icon.svg';
import notificationIcon from '@/assets/images/icons/notification.svg';
import { DropdownIcon, LogoIcon, NavLinkIcon, WalletIcon } from './svg';
import NotificationModal from '../notification-modal';
import { useFirestore } from '@/components/Firebasewrapper';
import vsIcon from '@/assets/images/icons/vs.svg';
import { createPublicClient, http, parseAbi, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';

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

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/0U4JEhe585vSsJzWGq6t9Ca-8OcNevKO',
  ),
});

const getBetEvents = async () => {
  const logs = await publicClient.getLogs({
    address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
    event: parseAbiItem(
      'event BetCreated(uint256 indexed _betId,address indexed actor1,address indexed actor2,string betName,uint256 duration,uint256 startTimeStamp,address creator,address betToken,uint256 betAmount)',
    ),
    args: {},
    fromBlock: BigInt(16376588),
    toBlock: BigInt((await publicClient.getBlock()).number),
  });
  return logs;
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(vsIcon);
  const [notificationCount, setNotificationCount] = useState(0);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const notificationModalRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [newBets, setNewBets] = useState<BetData>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const account = useAccount();
  const { getUsernameByAddress, getProfilePicture } = useFirestore();

  // Function to get live bets not entered
  const getLiveBetsNotEntered = async (liveBets: BetData, address: string) => {
    try {
      const results = await Promise.all(
        liveBets.map(async (bet) => {
          const entered = await publicClient.readContract({
            address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
            abi: parseAbi([
              'function entered(uint256,address) external view returns (bool)',
            ]),
            functionName: 'entered',
            args: [bet._betId as bigint, address as `0x${string}`],
          });
          return { bet, entered };
        }),
      );

      return results
        .filter((result) => result.entered === false)
        .map((result) => result.bet);
    } catch (err) {
      console.error('Error checking entered bets:', err);
      return [];
    }
  };

  // Function to fetch current live bets
  const getCurrentLiveBets = async (address: string) => {
    setIsLoading(true);
    try {
      const events = await getBetEvents();
      const betData: BetData = events.map((event) => ({
        _betId: event.args._betId,
        actor1: event.args.actor1,
        actor2: event.args.actor2,
        betName: event.args.betName,
        duration: event.args.duration,
        startTimeStamp: event.args.startTimeStamp,
        creator: event.args.creator,
        betToken: event.args.betToken,
        betAmount: event.args.betAmount,
      }));

      // Filter bets where the user is actor1 or actor2
      const userBets = betData.filter(
        (bet) => bet.actor1 === address || bet.actor2 === address,
      );

      // Filter for live bets (not expired)
      const currentTime = Math.floor(Date.now() / 1000);
      const liveBets = userBets.filter((bet) => {
        const expiryTime = Number(bet.startTimeStamp) + Number(bet.duration);
        return expiryTime > currentTime;
      });

      // Get bets not entered by the user
      const notEnteredBets = await getLiveBetsNotEntered(liveBets, address);

      setNewBets(notEnteredBets);
      setNotificationCount(notEnteredBets.length);
    } catch (err) {
      console.error('Error fetching live bets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch bets when account changes
  useEffect(() => {
    if (account.address) {
      getCurrentLiveBets(account.address);
    }
  }, [account.address]);

  // Effect to fetch usernames and avatars
  useEffect(() => {
    const fetchUsernamesAndAvatars = async () => {
      setIsLoading(true);
      try {
        const fetchedUsernames: { [key: string]: string } = {};
        const fetchedAvatars: { [key: string]: string } = {};

        await Promise.all(
          newBets.map(async (bet) => {
            if (bet.creator) {
              const username = await getUsernameByAddress(bet.creator);
              const avatar = await getProfilePicture(bet.creator);

              if (username) fetchedUsernames[bet.creator] = username;
              if (avatar) fetchedAvatars[bet.creator] = avatar;
            }
          }),
        );

        setUsernames(fetchedUsernames);
        setAvatars(fetchedAvatars);
      } catch (err) {
        console.error('Error fetching usernames and avatars:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (newBets.length > 0) {
      fetchUsernamesAndAvatars();
    }
  }, [newBets, getUsernameByAddress, getProfilePicture]);

  const handleNotificationCountChange = (count: number) => {
    setNotificationCount(count);
  };
  useEffect(() => {
    if (address) {
      getProfilePicture(address)
        .then((profilePicture) => {
          setUserAvatar(profilePicture || vsIcon);
        })
        .catch((error) => {
          console.error(
            `Error fetching profile picture for ${address}:`,
            error,
          );
          setUserAvatar(vsIcon);
        });
    }
  }, [address, getProfilePicture]);

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
        <Link href="/overview">
          <LogoIcon />
        </Link>

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
          <div className="wallet-balance" onClick={() => setIsModalOpen(true)}>
            <WalletIcon />
            <span>
              {address ? (
                <USDCBalance
                  walletAddress={address}
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
            {notificationCount > 0 && <span>{notificationCount}</span>}
          </div>

          <button
            className="profile-settings-dropdown"
            title="profile-settings"
            onClick={handleDropdownToggle}
          >
            <Image
              id="user-icon"
              src={userAvatar}
              alt="Profile"
              width={42}
              height={42}
            />
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

        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setNotificationModalOpen(false)}
          onNotificationCountChange={handleNotificationCountChange}
          newBets={newBets}
          usernames={usernames}
          avatars={avatars}
          loading={isLoading}
        />

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
