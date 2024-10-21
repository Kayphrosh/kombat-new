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
import { estimateMaxPriorityFeePerGasQueryOptions } from 'wagmi/query';
import Countdown from '../dashboard/overview/live-bets/countdown';
//0x4cF351F2667fdea44944C90802CbE25F89752Fec

export type BetData = Array<{
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
const Invitation = () => {
  const router = useRouter();
  const { id } = router.query;
  const account = useAccount();
  const [inviteData, setInviteData] = useState({
    description: '',
    option: '',
  });
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
  // console.log("page id", Number(id));
  // const betId = 6;

  const options = ['Yes', 'No'];
  const [activeOption, setActiveOption] = useState('Yes'); // Track active option
  const [challengerAddress, setChallengerAddress] = useState('');
  const [betData, setBetBetData] = useState<{
    actors: readonly `0x${string}`[];
    startTimeStamp: bigint;
    endTimeStamp: bigint;
    betCreator: `0x${string}`;
    betName: string;
    betId: bigint;
    betToken: `0x${string}`;
    amount: bigint;
    winner: `0x${string}`;
    betDisputed: boolean;
    betClaimed: boolean;
  }>();

  const challengerAvatar = Avatar;
  const { getBet, getUsernameByAddress } = useFirestore();
  getBet(String(id)).then((ivData) => {
    setInviteData(ivData);
  });

  const getId = (id: string | string[] | undefined) => {
    if (id === undefined) {
      // router.push('/overview');
      return '0';
    } else {
      return id;
    }
  };
  // console.log("iv", inviteData);
  // console.log("betData", betData?.actors[1]);
  const { data, isError, isLoading } = useReadContract({
    address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
    abi: KomatAbi,
    functionName: 'getBetDetails',
    args: [BigInt(getId(id) as string)],
  });
  // console.log(data?.actors);
  useEffect(() => {
    setBetBetData(data);
    if (data?.betCreator != undefined) {
      getUsernameByAddress(data?.betCreator as string).then((chal) => {
        console.log(chal);
        setChallengerAddress(chal as string);
      });
    }
  }, [challengerAddress]);
  // console.log(challengerAddress);
  // const challengerUsername = "kayphrosh";

  const handleAcceptKombat = () => {
    console.log('accept kombat');
  };
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    // console.log("LifecycleStatus", status);
  }, []);

  return (
    <div className="overview-container">
      <Navbar />

      <div className="invitation-content">
        <div className="challenger-details">
          <Image src={challengerAvatar} alt="" />
          <div className="text">
            @{challengerAddress} is challenging you to a kombat
          </div>
        </div>

        <div className="combat-details">
          <div className="time">
            <div className="time-left">
              <Image src={timeIcon} alt="" />
              <Countdown endTime={Number(data?.endTimeStamp)} />
            </div>

            <div className="stake">
              <div className="title">Stake</div>
              <div className="value">{data?.amount}</div>
            </div>
          </div>

          <div className="details">
            <h3>{data?.betName}</h3>

            <div className="desc">
              <div className="title">Description</div>
              <p>{inviteData?.description}</p>
            </div>

            <div className="options-container">
              <div className="title">Options</div>

              <div className="options">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`option ${
                      activeOption === option ? 'active' : ''
                    }`} // Add 'active' class
                    onClick={() => setActiveOption(option)} // Set active option on click
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleAcceptKombat}>
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
