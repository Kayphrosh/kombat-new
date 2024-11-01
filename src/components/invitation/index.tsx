import React, { useCallback, useEffect, useState } from 'react';
import logo from '@/assets/images/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import defaultAvatar from '@/assets/images/icons/default-avatar.svg';
import timeIcon from '@/assets/images/icons/time-icon.svg';
import Navbar from '../dashboard/navbar';
import { KomatAbi } from '@/KombatAbi';
import { useAccount, useReadContract } from 'wagmi';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
  LifecycleStatus,
} from '@coinbase/onchainkit/transaction';
import router, { useRouter } from 'next/router';
import { ContractFunctionParameters } from 'viem';
import { erc20ABI } from '@/erc20ABI';
import { useFirestore } from '../Firebasewrapper';
import Countdown from '../dashboard/overview/live-bets/countdown';

interface InviteData {
  description: string;
  option: string;
}

interface BetDetails {
  actors: readonly `0x${string}`[];
  startTimeStamp: bigint;
  endTimeStamp: bigint;
  betCreator: `0x${string}`;
  betName: string;
  betId: bigint;
  betDescription?: string;
  betToken: `0x${string}`;
  amount: bigint;
  winner: `0x${string}`;
  betDisputed: boolean;
  betClaimed: boolean;
}

const Invitation = () => {
  const router = useRouter();
  const { id } = router.query;
  const account = useAccount();

  // State management
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [activeOption, setActiveOption] = useState('Yes');
  const [challengerData, setChallengerData] = useState({
    username: '',
    avatar: defaultAvatar,
  });
  const [isLoading, setIsLoading] = useState(true);

  const { getBet, getUsernameByAddress, getProfilePicture } = useFirestore();

  // Contract read for bet details
  const { data: betDetails, isError } = useReadContract({
    address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
    abi: KomatAbi,
    functionName: 'getBetDetails',
    args: [BigInt((id as string) || '0')],
    enabled: !!id, 
  });

  // Format amount to display in USDC
  const formatAmount = (amount: bigint | undefined) => {
    if (!amount) return '0';
    return (Number(amount) / 1e18).toFixed(2);
  };

  // Contract parameters for transaction
  const contracts = [
    {
      address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
      abi: erc20ABI,
      functionName: 'approve',
      args: [
        '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
        Number(100000000000 * 1e18),
      ],
    },
    {
      address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
      abi: KomatAbi,
      functionName: 'enterBet',
      args: [Number(id), true],
    },
  ];

  // Fetch invite data and challenger details
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !betDetails?.betCreator) return;

      setIsLoading(true);
      try {
        // Fetch invite data
        const ivData = await getBet(String(id));
        setInviteData(ivData);

        // Fetch challenger details
        const username = await getUsernameByAddress(betDetails.betCreator);
        const avatar = await getProfilePicture(betDetails.betCreator);

        setChallengerData({
          username: username || betDetails.betCreator.slice(0, 6),
          avatar: avatar || defaultAvatar,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    id,
    betDetails?.betCreator,
    getBet,
    getUsernameByAddress,
    getProfilePicture,
  ]);

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('Transaction status:', status);
  }, []);

  if (isLoading) {
    return (
      <div className="overview-container">
        <Navbar />
        <div className="invitation-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError || !betDetails) {
    return (
      <div className="overview-container">
        <Navbar />
        <div className="invitation-content">
          <div className="error">Failed to load bet details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-container">
      <Navbar />

      <div className="invitation-content">
        <div className="challenger-details">
          <Image
            src={challengerData.avatar}
            alt="Challenger Avatar"
            width={64}
            height={64}
          />
          <div className="text">
            @{challengerData.username} is challenging you to a kombat
          </div>
        </div>

        <div className="combat-details">
          <div className="time">
            <div className="time-left">
              <Image src={timeIcon} alt="Time" width={20} height={20} />
              <Countdown endTime={Number(betDetails.endTimeStamp)} />
            </div>

            <div className="stake">
              <div className="title">Stake</div>
              <div className="value">${formatAmount(betDetails.amount)}</div>
            </div>
          </div>

          <div className="details">
            <h3>{betDetails.betName}</h3>

            <div className="desc">
              <div className="title">Description</div>
              <p>
                {inviteData?.description ||
                  betDetails.betDescription ||
                  'No description available'}
              </p>
            </div>

            <div className="options-container">
              <div className="title">Options</div>
              <div className="options">
                {['Yes', 'No'].map((option) => (
                  <div
                    key={option}
                    className={`option ${
                      activeOption === option ? 'active' : ''
                    }`}
                    onClick={() => setActiveOption(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button>
            <div>Accept Kombat</div> <Image src={buttonBg} alt="" />
            <Transaction
              chainId={84532}
              contracts={contracts as ContractFunctionParameters[]}
              onStatus={handleOnStatus}
              onSuccess={() => {
                console.log('success');
                router.push('/overview');
              }}
              onError={(err) => {
                console.log(err);
              }}
            >
              <TransactionButton text="Enter bet" className="tx-btton" />
              <TransactionSponsor />
              <TransactionStatus>
                <TransactionStatusLabel className="status-label" />
                <TransactionStatusAction className="status-label" />
              </TransactionStatus>
            </Transaction>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invitation;
