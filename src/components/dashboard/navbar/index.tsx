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
// import { VsIcon } from '@/components/dashboard/overview/live-bets/svg';
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

  const VsIconDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M30.8898 2.72998L30.1304 3.79873L33.6554 6.29623L34.4148 5.22373L30.8898 2.72998ZM22.6398 3.20248L24.9085 7.45498L25.0773 7.57592L26.4648 3.79217L22.6398 3.20248ZM28.0398 4.38654L26.5023 8.58654L30.3179 11.2875L33.6273 8.33061C33.5429 8.27623 33.4491 8.21904 33.3648 8.1581L28.0398 4.38654ZM5.6082 4.55248L6.62445 8.84904L9.40227 9.09279L9.65539 6.31498L5.6082 4.55248ZM44.146 7.06967C43.621 7.51123 43.0023 7.87498 42.3179 8.17029C42.7866 12.525 40.9398 15.9937 38.0804 18.4594C35.596 20.6062 32.371 22.0594 29.1741 22.95C28.9398 23.4 28.7054 23.8125 28.4804 24.1781C32.371 24.6844 37.2179 22.1906 40.5929 18.5531C42.4491 16.5562 43.8554 14.25 44.446 12.0656C44.9335 10.2469 44.8866 8.55748 44.146 7.06967ZM11.2116 7.88623L10.9304 10.9312L7.89758 10.6594L29.1366 36.0656L31.0116 34.5L32.446 33.3L11.2116 7.88623ZM40.6866 8.72717C40.2929 8.82092 39.8898 8.91467 39.4866 8.98029C38.0898 9.21467 36.6648 9.27092 35.4085 9.00842L31.5648 12.4406C31.9398 13.0969 32.0335 13.9125 31.9866 14.7375C31.9304 15.9187 31.5835 17.2406 31.1148 18.5719C30.8335 19.35 30.5241 20.1281 30.1866 20.8781C32.7085 20.0156 35.1179 18.7875 36.9835 17.1844C39.4398 15.0469 40.9679 12.3469 40.6866 8.72717ZM25.6866 10.0687L20.8866 16.8375L23.7554 20.2594L29.2116 12.5625L25.6866 10.0687ZM16.2929 23.325L3.23633 41.7375L6.75477 44.2312L19.1523 26.7469L16.2929 23.325ZM38.1366 30.75L25.621 41.2031L27.421 43.3687L39.9366 32.9062L38.1366 30.75ZM36.421 38.0531L33.1116 40.8094L36.8335 45.2719L40.1429 42.5156L36.421 38.0531Z' fill='white'/%3E%3C/svg%3E";

      const [userAvatar, setUserAvatar] = useState<string>(VsIconDataUrl);
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

      const userBets = betData.filter(
        (bet) => bet.actor1 === address || bet.actor2 === address,
      );

      const currentTime = Math.floor(Date.now() / 1000);
      const liveBets = userBets.filter((bet) => {
        const expiryTime = Number(bet.startTimeStamp) + Number(bet.duration);
        return expiryTime > currentTime;
      });

      const notEnteredBets = await getLiveBetsNotEntered(liveBets, address);

      setNewBets(notEnteredBets);
      setNotificationCount(notEnteredBets.length);
    } catch (err) {
      console.error('Error fetching live bets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account.address) {
      getCurrentLiveBets(account.address);
    }
  }, [account.address]);

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
          setUserAvatar(profilePicture || VsIconDataUrl);
        })
        .catch((error) => {
          console.error(
            `Error fetching profile picture for ${address}:`,
            error,
          );
          setUserAvatar(VsIconDataUrl);
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
        <Link href="/">
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
