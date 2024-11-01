import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  PlusIcon,
  ButtonBg,
  LiveBetBgMobile,
  ArrowIcon,
} from '../live-bets/svg';

import { useFirestore } from '@/components/Firebasewrapper';

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

type UserDetails = {
  avatar: string;
  username: string;
  isLoading?: boolean;
};

const VsIconDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M30.8898 2.72998L30.1304 3.79873L33.6554 6.29623L34.4148 5.22373L30.8898 2.72998ZM22.6398 3.20248L24.9085 7.45498L25.0773 7.57592L26.4648 3.79217L22.6398 3.20248ZM28.0398 4.38654L26.5023 8.58654L30.3179 11.2875L33.6273 8.33061C33.5429 8.27623 33.4491 8.21904 33.3648 8.1581L28.0398 4.38654ZM5.6082 4.55248L6.62445 8.84904L9.40227 9.09279L9.65539 6.31498L5.6082 4.55248ZM44.146 7.06967C43.621 7.51123 43.0023 7.87498 42.3179 8.17029C42.7866 12.525 40.9398 15.9937 38.0804 18.4594C35.596 20.6062 32.371 22.0594 29.1741 22.95C28.9398 23.4 28.7054 23.8125 28.4804 24.1781C32.371 24.6844 37.2179 22.1906 40.5929 18.5531C42.4491 16.5562 43.8554 14.25 44.446 12.0656C44.9335 10.2469 44.8866 8.55748 44.146 7.06967ZM11.2116 7.88623L10.9304 10.9312L7.89758 10.6594L29.1366 36.0656L31.0116 34.5L32.446 33.3L11.2116 7.88623ZM40.6866 8.72717C40.2929 8.82092 39.8898 8.91467 39.4866 8.98029C38.0898 9.21467 36.6648 9.27092 35.4085 9.00842L31.5648 12.4406C31.9398 13.0969 32.0335 13.9125 31.9866 14.7375C31.9304 15.9187 31.5835 17.2406 31.1148 18.5719C30.8335 19.35 30.5241 20.1281 30.1866 20.8781C32.7085 20.0156 35.1179 18.7875 36.9835 17.1844C39.4398 15.0469 40.9679 12.3469 40.6866 8.72717ZM25.6866 10.0687L20.8866 16.8375L23.7554 20.2594L29.2116 12.5625L25.6866 10.0687ZM16.2929 23.325L3.23633 41.7375L6.75477 44.2312L19.1523 26.7469L16.2929 23.325ZM38.1366 30.75L25.621 41.2031L27.421 43.3687L39.9366 32.9062L38.1366 30.75ZM36.421 38.0531L33.1116 40.8094L36.8335 45.2719L40.1429 42.5156L36.421 38.0531Z' fill='white'/%3E%3C/svg%3E";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/0U4JEhe585vSsJzWGq6t9Ca-8OcNevKO',
  ),
});

const getBetEvents = async () => {
  try {
    const block = await publicClient.getBlock();
    const logs = await publicClient.getLogs({
      address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
      event: parseAbiItem(
        'event BetCreated(uint256 indexed _betId,address indexed actor1,address indexed actor2,string betName,uint256 duration,uint256 startTimeStamp,address creator,address betToken,uint256 betAmount)',
      ),
      fromBlock: BigInt(16376588),
      toBlock: BigInt(block.number),
    });
    return logs;
  } catch (error) {
    console.error('Error fetching bet events:', error);
    return [];
  }
};

type CompletedBetsProps = {
  setCompletedBetsCount: (count: number) => void;
};

const History: React.FC<CompletedBetsProps> = ({ setCompletedBetsCount }) => {
  const [completedBetsData, setCompletedBetsData] = useState<BetData>([]);
  const [userDetails, setUserDetails] = useState<{
    [address: string]: UserDetails;
  }>({});
  const { getProfilePicture, getUsernameByAddress } = useFirestore();
  const { address } = useAccount();
  const account = useAccount();
  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const fetchUserDetails = useCallback(
    async (userAddress: string) => {
      if (!userAddress) return;

      // Return existing details if already loaded
      if (userDetails[userAddress] && !userDetails[userAddress].isLoading) {
        return;
      }

      // Set loading state
      setUserDetails((prev) => ({
        ...prev,
        [userAddress]: {
          avatar: VsIconDataUrl,
          username: formatAddress(userAddress),
          isLoading: true,
        },
      }));

      try {
        const [username, profilePicture] = await Promise.all([
          getUsernameByAddress(userAddress),
          getProfilePicture(userAddress),
        ]);

        setUserDetails((prev) => ({
          ...prev,
          [userAddress]: {
            avatar: profilePicture || VsIconDataUrl,
            username: username || formatAddress(userAddress),
            isLoading: false,
          },
        }));
      } catch (error) {
        console.error(`Error fetching user details for ${userAddress}:`, error);
        setUserDetails((prev) => ({
          ...prev,
          [userAddress]: {
            avatar: VsIconDataUrl,
            username: formatAddress(userAddress),
            isLoading: false,
          },
        }));
      }
    },
    [getUsernameByAddress, getProfilePicture, userDetails],
  );

  useEffect(() => {
    const fetchAllUserDetails = async () => {
      const uniqueAddresses = new Set<string>();

      completedBetsData.forEach((bet) => {
        if (bet.actor1) uniqueAddresses.add(bet.actor1);
        if (bet.actor2) uniqueAddresses.add(bet.actor2);
      });

      await Promise.all(Array.from(uniqueAddresses).map(fetchUserDetails));
    };

    if (completedBetsData.length > 0) {
      fetchAllUserDetails();
    }
  }, [completedBetsData, fetchUserDetails]);

  useEffect(() => {
    const getCompletedBets = async (address: string) => {
      const betData: BetData = [];

      const events = await getBetEvents();
      for (let i = 0; i < events.length; i++) {
        betData.push(
          events[i].args as {
            _betId?: bigint;
            actor1?: `0x${string}`;
            actor2?: `0x${string}`;
            betName?: string;
            duration?: BigInt;
            startTimeStamp?: BigInt;
            creator?: `0x${string}`;
            betToken?: `0x${string}`;
            betAmount?: BigInt;
          },
        );
      }

      const filterBetsByActor = (actor: string) => {
        return betData.filter(
          (bet) => bet.actor1 === actor || bet.actor2 === actor,
        );
      };

      const userBetData: BetData = filterBetsByActor(address);

      const completedBets = userBetData.filter((bet) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiryTime = Number(bet.startTimeStamp) + Number(bet.duration);
        return expiryTime < currentTime;
      });

      setCompletedBetsData(completedBets);
      setCompletedBetsCount(completedBets.length);
    };

    if (account.address) {
      getCompletedBets(account.address);
    }
  }, [account.address, setCompletedBetsCount]);

  const getDisplayName = (userAddress: string | undefined) => {
    if (!userAddress) return '';
    if (userAddress === address) return 'You';

    const details = userDetails[userAddress];
    return details?.username || formatAddress(userAddress);
  };

  const getAvatar = (userAddress: string | undefined) => {
    if (!userAddress) return VsIconDataUrl;
    return userDetails[userAddress]?.avatar || VsIconDataUrl;
  };

  return (
    <main className="live-bets-container">
      <div className="livebets">
        {completedBetsData.length === 0 ? (
          <div className="no-live-bets">
            <Image src={VsIconDataUrl} alt="VS Icon" width={48} height={48} />
            <p>
              No kombat is in your history, click the button below to enter the
              Arena
            </p>
            <Link href="./new-kombat" id="new-kombat-btn">
              <button>
                <div className="btn-text">
                  New Kombat
                  <PlusIcon />
                </div>
                <div className="bg">
                  <ButtonBg />
                </div>
              </button>
            </Link>
          </div>
        ) : (
          completedBetsData.map((bet) => (
            <div className="livebet" key={bet._betId?.toString()}>
              <div className="live-bg-mobile">
                <LiveBetBgMobile />
              </div>
              <div className="content">
                <div className="players-info">
                  <div className="player">
                    <Image
                      src={getAvatar(bet.actor1)}
                      alt="Actor 1"
                      width={50}
                      height={50}
                    />
                    <p>{getDisplayName(bet.actor1)}</p>
                  </div>
                  <span>VS</span>
                  <div className="player">
                    <Image
                      src={getAvatar(bet.actor2)}
                      alt="Actor 2"
                      width={50}
                      height={50}
                    />
                    <p>{getDisplayName(bet.actor2)}</p>
                  </div>
                </div>
                <div className="details">
                  <p id="title">{bet.betName}</p>
                  <div className="time-left">
                    <p className="ended">Ended</p>
                  </div>
                </div>
                <div className="stake">
                  <span>
                    <p id="title">Stake:</p>
                    <p id="value">${Number(bet.betAmount) / 1e18}</p>
                  </span>
                  <div className="time-mobile">
                    <p className="ended">Ended</p>
                  </div>
                </div>
                <div className="cta">
                  <Link href={`/livebet/${bet._betId}`}>
                    <button className="arrowButton" title="View Details">
                      <ArrowIcon />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-footer"></div>
    </main>
  );
};

export default History;
