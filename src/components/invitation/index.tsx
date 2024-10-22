import React, { useCallback, useEffect, useState } from 'react';
import logo from '@/assets/images/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Avatar from '@/assets/images/icons/avatar-2.png';
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

export type BetData = Array<{
  _betId?: bigint | undefined;
  actor1?: `0x${string}` | undefined;
  actor2?: `0x${string}` | undefined;
  betName?: string | undefined;
  betDescription?: string | undefined;
  duration?: BigInt | undefined;
  startTimeStamp?: BigInt | undefined;
  creator?: `0x${string}` | undefined;
  betToken?: `0x${string}` | undefined;
  betAmount?: BigInt | undefined;
}>;

const Invitation = () => {
  const router = useRouter();
  const { id } = router.query;
  const account = useAccount();
  const [inviteData, setInviteData] = useState({
    description: '',
    option: '',
  });
  const [activeOption, setActiveOption] = useState('Yes');
  const [challengerAddress, setChallengerAddress] = useState('');
  const [betData, setBetBetData] = useState<
    | {
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
    | undefined
  >(undefined);
  console.log(betData);
  const challengerAvatar = Avatar;
  const { getBet, getUsernameByAddress } = useFirestore();

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

  const getId = (id: string | string[] | undefined) => {
    if (id === undefined) {
      return '0';
    } else {
      return id;
    }
  };

  const { data, isError, isLoading } = useReadContract({
    address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
    abi: KomatAbi,
    functionName: 'getBetDetails',
    args: [BigInt(getId(id) as string)],
  });

  useEffect(() => {
    const fetchBetData = async () => {
      const ivData = await getBet(String(id));
      console.log('Fetched Invitation Data:', ivData);
      setInviteData(ivData);

      if (ivData && ivData.betCreator) {
        const chal = await getUsernameByAddress(ivData.betCreator);
        console.log('Fetched Challenger Address:', chal);
        setChallengerAddress(chal as string);
      }
    };

    fetchBetData();
  }, [id, getBet, getUsernameByAddress]);

  useEffect(() => {
    console.log('Fetched Bet Data:', data);
    if (data) {
      setBetBetData(data);
    }
  }, [data]);

  const handleAcceptKombat = () => {
    console.log('Accept Kombat');
  };

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading invitation.</div>;

  return (
    <div className="overview-container">
      {/* <Navbar /> */}

      <div className="invitation-content">
        <div className="challenger-details">
          <Image src={challengerAvatar} alt="Challenger Avatar" />
          <div className="text">
            @{challengerAddress} is challenging you to a kombat
          </div>
        </div>

        <div className="combat-details">
          <div className="time">
            <div className="time-left">
              <Image src={timeIcon} alt="Time Icon" />
              <Countdown endTime={Number(data?.endTimeStamp)} />
            </div>

            <div className="stake">
              <div className="title">Stake:</div>
              <div className="value">${Number(data?.amount) / 1e18}</div>
            </div>
          </div>

          <div className="details">
            <h3>{data?.betName}</h3>

            <div className="desc">
              <div className="title">Description</div>
              <p>{inviteData?.description || 'No description available'}</p>
            </div>

            <div className="options-container">
              <div className="title">Options</div>

              <div className="options">
                {['Yes', 'No'].map((option, index) => (
                  <div
                    key={index}
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

          <button onClick={handleAcceptKombat}>
            <div>Accept Kombat</div>
            <Image src={buttonBg} alt="" />
            <Transaction
              chainId={84532}
              contracts={contracts as ContractFunctionParameters[]}
              onStatus={handleOnStatus}
              onSuccess={() => {
                console.log('Success');
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
