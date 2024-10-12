import React, { useEffect } from 'react';
import liveIcon from '@/assets/images/icons/live.png';
import plusIcon from '@/assets/images/icons/plus.svg';
import arrowIcon from '@/assets/images/icons/arrow-right.svg';
import Image from 'next/image';
import Link from 'next/link';
import NewKombatBtnBg from '@/assets/images/icons/new-kombat-btn-bg.svg';
import { liveBets } from './livebet-data'; // Import centralized data
import { useAccount } from 'wagmi';
import { useWatchContractEvent } from 'wagmi';
import { KomatAbi } from '@/KombatAbi';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Hex } from 'viem';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/0U4JEhe585vSsJzWGq6t9Ca-8OcNevKO',
  ),
});

const getBetEvents = async () => {
  const logs = await publicClient.getLogs({
    address: '0x4432fCE60bbC8dB0a34F722c7e5F89FB7F74a944',
    event: parseAbiItem(
      'event BetCreated(uint256 indexed _betId,address indexed actor1,address indexed actor2,string betName,uint256 duration,uint256 startTimeStamp,address creator,address betToken,uint256 betAmount)',
    ),
    args: {},
    fromBlock: BigInt(16376588),
    toBlock: BigInt(16392874),
  });
  return logs;
};

const LiveBets = () => {
  useEffect(() => {}, []);
  const betData: Array<{
    _betId?: bigint | undefined;
    actor1?: `0x${string}` | undefined;
    actor2?: `0x${string}` | undefined;
    betName?: string | undefined;
    duration?: bigint | undefined;
    startTimeStamp?: bigint | undefined;
    creator?: `0x${string}` | undefined;
    betToken?: `0x${string}` | undefined;
    betAmount?: bigint | undefined;
  }> = [];
  var liveBetsData: Array<{
    actor1: string;
    actor2: string;
    betAmount: BigInt;
    betName: string;
    betToken: string;
    creator: string;
    duration: BigInt;
    startTimeStamp: BigInt;
    _betId: BigInt;
  }> = [];
  useEffect(() => {
    const events = getBetEvents();
    console.log(events);
    events
      .then((data) => {
        // console.log(data[0]?.args);
        for (let i = 0; i < data.length; i++) {
          betData.push(data[i].args);
        }
        console.log(betData);
        const filterBetsByActor = (actor: string) => {
          return betData.filter(
            (bet) => bet.actor1 === actor || bet.actor2 === actor,
          );
        };
        const userBetData: Array<{
          _betId?: bigint | undefined;
          actor1?: `0x${string}` | undefined;
          actor2?: `0x${string}` | undefined;
          betName?: string | undefined;
          duration?: bigint | undefined;
          startTimeStamp?: bigint | undefined;
          creator?: `0x${string}` | undefined;
          betToken?: `0x${string}` | undefined;
          betAmount?: bigint | undefined;
        }> = filterBetsByActor('0xa433f323541CF82f97395076B5F83a7A06F1646c');

        const liveBets: Array<{}> = userBetData.filter((bet) => {
          const currentTime = Math.floor(Date.now() / 1000);
          return userBetData.filter((bet) => {
            const expiryTime =
              Number(bet.startTimeStamp) + Number(bet.duration);
            return expiryTime > currentTime;
          });
        });
        console.log('live bet data', liveBets);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const account = useAccount();
  getBetEvents().then((data) => console.log('data', data));
  return (
    <main className="live-bets-container">
      <div className="title">
        <h3>
          Live kombats <Image src={liveIcon} alt="" />
        </h3>
        <Link href="./new-kombat" id="new-kombat-btn">
          <button>
            <div className="btn-text">
              New Kombat
              <Image src={plusIcon} alt="" />
            </div>
            <div className="bg">
              <Image src={NewKombatBtnBg} alt="" />
            </div>
          </button>
        </Link>
      </div>

      <div className="livebets">
        {liveBets.map((livebet) => {
          return (
            <div className="livebet" key={livebet.id}>
              <div className="players-info">
                <div className="player">
                  <Image src={livebet.youImage} alt="You" /> {/* Your avatar */}
                  <p>You</p>
                </div>

                <span>VS</span>

                <div className="player">
                  <Image src={livebet.opponentImage} alt={livebet.opponent} />{' '}
                  {/* Opponent avatar */}
                  <p>{livebet.opponent}</p>
                </div>
              </div>

              <div className="details">
                <p id="title">Who will win the ballon d'or?</p>
                <p id="time-left">{livebet.timeLeft}</p>
              </div>
              <div className="stake">
                <p id="title">Kombat Stake:</p>
                <p id="value">{livebet.stake}</p>
              </div>

              <div className="cta">
                <Link href={`/livebet/${livebet.id}`}>
                  <button className="arrowButton" title="arrow">
                    <Image src={arrowIcon} alt="View Bet" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default LiveBets;
