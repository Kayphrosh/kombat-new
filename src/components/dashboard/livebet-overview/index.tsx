import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../navbar';
import backIcon from '@/assets/images/icons/back-icon.svg';
import timeIcon from '@/assets/images/icons/time-icon.svg';
import Image from 'next/image';
import Countdown from '../overview/live-bets/countdown';
import { useReadContract } from 'wagmi';
import { KomatAbi } from '@/KombatAbi';
import { useAccount } from 'wagmi';
import { ButtonBgSvg } from './svg';
import SelectWinnerModal from '../select-winner-modal';
import { useFirestore } from '@/components/Firebasewrapper';
// import vsIcon from '@/assets/images/icons/vs.svg'; // default image
import {
  LifecycleStatus,
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import {
  ContractFunctionParameters,
  createPublicClient,
  http,
  parseAbi,
} from 'viem';
import { baseSepolia } from '@/chain';

const VsIconDataUrl =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M30.8898 2.72998L30.1304 3.79873L33.6554 6.29623L34.4148 5.22373L30.8898 2.72998ZM22.6398 3.20248L24.9085 7.45498L25.0773 7.57592L26.4648 3.79217L22.6398 3.20248ZM28.0398 4.38654L26.5023 8.58654L30.3179 11.2875L33.6273 8.33061C33.5429 8.27623 33.4491 8.21904 33.3648 8.1581L28.0398 4.38654ZM5.6082 4.55248L6.62445 8.84904L9.40227 9.09279L9.65539 6.31498L5.6082 4.55248ZM44.146 7.06967C43.621 7.51123 43.0023 7.87498 42.3179 8.17029C42.7866 12.525 40.9398 15.9937 38.0804 18.4594C35.596 20.6062 32.371 22.0594 29.1741 22.95C28.9398 23.4 28.7054 23.8125 28.4804 24.1781C32.371 24.6844 37.2179 22.1906 40.5929 18.5531C42.4491 16.5562 43.8554 14.25 44.446 12.0656C44.9335 10.2469 44.8866 8.55748 44.146 7.06967ZM11.2116 7.88623L10.9304 10.9312L7.89758 10.6594L29.1366 36.0656L31.0116 34.5L32.446 33.3L11.2116 7.88623ZM40.6866 8.72717C40.2929 8.82092 39.8898 8.91467 39.4866 8.98029C38.0898 9.21467 36.6648 9.27092 35.4085 9.00842L31.5648 12.4406C31.9398 13.0969 32.0335 13.9125 31.9866 14.7375C31.9304 15.9187 31.5835 17.2406 31.1148 18.5719C30.8335 19.35 30.5241 20.1281 30.1866 20.8781C32.7085 20.0156 35.1179 18.7875 36.9835 17.1844C39.4398 15.0469 40.9679 12.3469 40.6866 8.72717ZM25.6866 10.0687L20.8866 16.8375L23.7554 20.2594L29.2116 12.5625L25.6866 10.0687ZM16.2929 23.325L3.23633 41.7375L6.75477 44.2312L19.1523 26.7469L16.2929 23.325ZM38.1366 30.75L25.621 41.2031L27.421 43.3687L39.9366 32.9062L38.1366 30.75ZM36.421 38.0531L33.1116 40.8094L36.8335 45.2719L40.1429 42.5156L36.421 38.0531Z' fill='white'/%3E%3C/svg%3E";

type BetDetails = {
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
  winnerDeclaredBy?: `0x${string}`;
};

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/0U4JEhe585vSsJzWGq6t9Ca-8OcNevKO',
  ),
});

const BetOverview: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = router.query;
  const { getBet, getUsernameByAddress, getProfilePicture } = useFirestore();
  const { address: currentUserAddress } = useAccount();
  const [activeOption, setActiveOption] = useState('');
  const [accounts, setAccounts] = useState<
    { userName: string; avatar: string; address: string }[]
  >([]);
  const [fbData, setFbData] = useState<any | null>(null);
  const [hasDeclaredWinner, setHasDeclaredWinner] = useState(false);
  const [buttonState, setButtonState] = useState<
    'Declare' | 'Claim' | 'Dispute'
  >('Declare');

  const getId = (id: string | string[] | undefined) => {
    if (id === undefined) {
      return '';
    } else {
      return id;
    }
  };
  const claimTx = [
    {
      address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
      abi: KomatAbi,
      functionName: 'claim',
      args: [BigInt(getId(id) as string)],
    },
  ];
  console.log('getId', getId(id));

  const { data, isError, isLoading } = useReadContract({
    address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
    abi: KomatAbi,
    functionName: 'getBetDetails',
    args: [BigInt(getId(id) as string)],
  });
  const getBetState = async () => {
    const details = await publicClient.readContract({
      address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
      abi: KomatAbi,
      functionName: 'getBetDetails',
      args: [BigInt(getId(id) as string)],
    });
    return details;
  };

  const getOppositeOption = (option: string) => {
    return option.toLowerCase() === 'yes'
      ? 'no'
      : option.toLowerCase() === 'no'
      ? 'yes'
      : '';
  };

  useEffect(() => {
    getBetState().then((details) => {
      if (details.betDisputed === true) {
        setButtonState('Dispute');
      }
      if (
        details.betDisputed === false &&
        details.winner == currentUserAddress
      ) {
        setButtonState('Claim');
      }
    });
  }, [getBetState]);

  useEffect(() => {
    getBet(getId(id) as string).then((data) => {
      console.log('fbData', data);
      setFbData(data);

      if (fbData?.option) {
        setActiveOption(getOppositeOption(fbData.option));
      }
    });
  }, [getBet, id]);

  useEffect(() => {
    if (data?.actors) {
      const fetchActorData = async () => {
        const accountsData = await Promise.all(
          data.actors.map(async (actor: string) => {
            const userName = (await getUsernameByAddress(actor)) || actor;
            const avatar = (await getProfilePicture(actor)) || VsIconDataUrl;
            return { userName, avatar, address: actor };
          }),
        );
        setAccounts(accountsData);
      };
      fetchActorData();
    }
  }, [data, getUsernameByAddress, getProfilePicture]);

  const handleDispute = () => {
    setButtonState('Dispute');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error fetching bet details or Bet not found.</div>;
  }

  const warriors = {
    id: id as string,
    amount: (Number(data?.amount) / 1e18).toString(),
  };
  // const handleOnStatus = useCallback((status: LifecycleStatus) => {
  //   console.log('LifecycleStatus', status);
  //   // console.log('BetId', betId);
  //   // writeFireBaseData(betId);
  // }, []);
  return (
    <div className="overview-container new-combat-container">
      <div className="invite-friends-content">
        <div className="back-btn" onClick={() => router.back()}>
          <Image src={backIcon} alt="Back" />
          BACK
        </div>
        <div className="invite-friends-details">
          <div className="combat-details">
            <div className="time">
              <div className="time-left">
                <Image src={timeIcon} alt="Time Left" />
                <Countdown
                  endTime={
                    Number(data?.startTimeStamp) +
                    Number(data?.endTimeStamp) -
                    Number(data.startTimeStamp)
                  }
                />
              </div>
              {buttonState === 'Declare' && (
                <button
                  className="declare-winner"
                  onClick={() => setIsModalOpen(true)}
                >
                  <div>Declare Winner</div>
                  <ButtonBgSvg />
                </button>
              )}
              {buttonState === 'Claim' && (
                <div className="claim-btn">
                  <ButtonBgSvg />

                  <Transaction
                    chainId={84532}
                    contracts={claimTx as ContractFunctionParameters[]}
                    onSuccess={() => {
                      console.log('success');
                      setIsModalOpen(false);
                    }}
                    className="transaction"
                  >
                    <TransactionButton text="Claim" className="tx-btton" />
                    <TransactionSponsor />
                    <TransactionStatus>
                      <TransactionStatusLabel className="status-label" />
                      <TransactionStatusAction className="status-label" />
                    </TransactionStatus>
                  </Transaction>
                </div>
              )}
              {buttonState === 'Dispute' && (
                <button onClick={handleDispute}>
                  <div>Dispute</div>
                </button>
              )}
              {/* <button onClick={() => setIsModalOpen(true)}>
                <div>Declare Winner</div>
                <Image src={buttonBg} alt="Declare Winner" />
              </button> */}
            </div>
            <div className="details">
              <h3>{data?.betName}</h3>
              <div className="desc">
                <div className="title">Description</div>
                <p>{fbData?.description}</p>
              </div>

              <div className="options-container">
                <div className="title">Options</div>
                <div className="options">
                  <div className="option">
                    <span>{fbData?.option}</span>
                  </div>
                  <div className="option active">
                    <span> {activeOption}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="stake">
              <div className="title">Your Stake:</div>
              <div className="value">${warriors.amount}</div>
            </div>
          </div>
          <div className="combat-warriors-container">
            <div className="title">
              <h4>Kombat Warriors</h4>
            </div>
            <div className="combat-warriors">
              {accounts.map((account, index) => (
                <div className="warrior" key={index}>
                  <div className="user-desc">
                    <Image
                      src={account.avatar}
                      alt="Avatar"
                      width={50}
                      height={50}
                    />
                    <span>
                      {account.address.toLowerCase() ===
                      currentUserAddress?.toLowerCase()
                        ? 'You'
                        : account.userName}
                    </span>
                  </div>
                  <div className="amount">${warriors.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SelectWinnerModal closeModal={() => setIsModalOpen(false)} id={id} />
      )}
    </div>
  );
};

export default BetOverview;
