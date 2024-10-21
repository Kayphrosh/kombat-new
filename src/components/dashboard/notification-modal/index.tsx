import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CloseIcon from '@/assets/images/close.svg';
import userAvatar from '@/assets/images/icons/avatar-2.png';
import ArrowIcon from '@/assets/images/icons/arrow-.svg';
import { useFirestore } from '@/components/Firebasewrapper';
import {
  Account,
  createPublicClient,
  http,
  parseAbi,
  parseAbiItem,
} from 'viem';
import { baseSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import invitation from '@/pages/invitation';
import { AtRule } from 'postcss';

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

const NotificationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const notification = [{}];
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  const [newBets, setNewBets] = useState<BetData>([]);
  const [usernames, setusernames] = useState<Array<string>>([]);
  const account = useAccount();

  const { getUsernameByAddress } = useFirestore();

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
          console.log(`Bet ${bet._betId} entered:`, entered);
          return { bet, entered };
        }),
      );

      const notEnteredBets = results
        .filter((result) => result.entered === false)
        .map((result) => result.bet);

      return notEnteredBets;
    } catch (err) {
      console.error('Error fetching bets:', err);
      throw new Error('Failed to fetch bets.');
    }
  };

  useEffect(() => {
    const getCurrentLiveBets = async (address: string) => {
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

      const liveBets = userBetData.filter((bet) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiryTime = Number(bet.startTimeStamp) + Number(bet.duration);
        return expiryTime > currentTime;
      });

      getLiveBetsNotEntered(liveBets, account.address as string);
      const fetchBets = async () => {
        try {
          const bets = await getLiveBetsNotEntered(
            liveBets,
            account.address as string,
          );
          setNewBets(bets);
        } catch (err) {
          // setError((err as Error).message);
          console.error(err);
        }
      };
      fetchBets();
    };

    if (account.address) {
      getCurrentLiveBets(account.address as `0x${string}`);
    }
  }, [account.address]);

  useEffect(() => {
    for (let i = 0; i < newBets.length; i++) {
      if (newBets[i].creator != undefined) {
        getUsernameByAddress(newBets[i].creator as string).then((un) => {
          newBets[i].creator = un as `0x{string}`;
        });
      }
    }
  }, [newBets]);

  console.log('notfis', newBets);
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
            {newBets.map((notif) => {
              return (
                <Link href={`/invitation/${notif._betId}`}>
                  <div className="notification-item">
                    <Image
                      className="challenger-image"
                      src={userAvatar}
                      alt="Challenger"
                    />
                    <div className="notification-details">
                      <h4>{notif.creator} invited you</h4>
                      <p>{notif.betName}</p>
                    </div>
                    <div className="amount">
                      {Math.floor(Number(notif.betAmount) / 1e18)}
                    </div>
                    <div className="arrow-right">
                      <Image src={ArrowIcon} alt="" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationModal;
