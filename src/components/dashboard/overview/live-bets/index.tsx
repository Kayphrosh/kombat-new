import React, { useEffect, useState } from 'react';
import liveIcon from '@/assets/images/icons/live.png';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { KomatAbi } from '@/KombatAbi';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import Countdown from './countdown';
import { PlusIcon, ButtonBg, LiveBetBgMobile, ArrowIcon } from './svg';
import vsIcon from '@/assets/images/icons/vs.svg';
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

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    'https://base-sepolia.g.alchemy.com/v2/0U4JEhe585vSsJzWGq6t9Ca-8OcNevKO',
  ),
});

const safeBigInt = (value: string | number | bigint | undefined) => {
  if (value === undefined) return BigInt(0);
  return BigInt(value);
};

const getBetEvents = async () => {
  const logs = await publicClient.getLogs({
    address: '0xf8c6136FEDc00E5b380D76Dda4A9232839aE25F6',
    event: parseAbiItem(
      'event BetCreated(uint256 indexed _betId,address indexed actor1,address indexed actor2,string betName,uint256 duration,uint256 startTimeStamp,address creator,address betToken,uint256 betAmount)',
    ),
    args: {},
    fromBlock: BigInt(16376588),
    toBlock: BigInt((await publicClient.getBlock()).number),
  });
  return logs;
};

const LiveBets = () => {
  const [liveBetsData, setLiveBetsData] = useState<BetData>([]);
  const { getProfilePicture, checkUserExists, getAddressByUsername } =
    useFirestore();
  const [usernames, setUsernames] = useState<{ [address: string]: string }>({});
  const [avatars, setAvatars] = useState<{ [address: string]: string }>({});
  const account = useAccount();

  const { address } = useAccount();
  const [userAvatar, setUserAvatar] = useState<string>(vsIcon);



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

  const fetchUserDetails = async (address: string) => {
    try {
      const exists = await checkUserExists(address);
      let profilePicture = vsIcon;

      if (exists) {
        profilePicture = await getProfilePicture(address);
      }

      const username = address.slice(0, 6) + '...' + address.slice(-4);
      setAvatars((prev) => ({ ...prev, [address]: profilePicture }));
      setUsernames((prev) => ({ ...prev, [address]: username }));
    } catch (error) {
      console.error(`Error fetching user details for ${address}:`, error);
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

      setLiveBetsData(liveBets);

      // Fetch user details for each actor in live bets
      const uniqueActors = new Set<string>();
      liveBets.forEach((bet) => {
        if (bet.actor1 && bet.actor1 !== address) uniqueActors.add(bet.actor1);
        if (bet.actor2 && bet.actor2 !== address) uniqueActors.add(bet.actor2);
      });

      uniqueActors.forEach(async (actor) => {
        await fetchUserDetails(actor);
      });
    };

    if (account.address) {
      getCurrentLiveBets(account.address as `0x${string}`);
    }
  }, [account.address]);

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
              <PlusIcon />
            </div>
            <div className="bg">
              <ButtonBg />
            </div>
          </button>
        </Link>
      </div>
      <div className="livebets">
        {liveBetsData.length === 0 ? (
          <div className="no-live-bets">
            <Image src={vsIcon} alt="" />
            <p>
              No kombat is currently live, click the button below to enter the
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
          liveBetsData.map((livebet) => (
            <div className="livebet" key={livebet._betId}>
              <div className="live-bg-mobile">
                <LiveBetBgMobile />
              </div>

              <div className="content">
                <div className="players-info">
                  <div className="player">
                    <Image
                      src={userAvatar}
                      alt="Actor 1"
                      width={50}
                      height={50}
                    />
                    <p>
                      {livebet.actor1 === account.address
                        ? 'You'
                        : usernames[livebet.actor1!] ||
                          `${livebet.actor1?.slice(
                            0,
                            4,
                          )}...${livebet.actor1?.slice(-4)}`}
                    </p>
                  </div>
                  <span>VS</span>
                  <div className="player">
                    <Image
                      src={
                        livebet.actor2 === account.address
                          ? vsIcon
                          : avatars[livebet.actor2!] || vsIcon
                      }
                      alt="Actor 2"
                      width={50}
                      height={50}
                    />
                    <p>
                      {livebet.actor2 === account.address
                        ? 'You'
                        : usernames[livebet.actor2!] ||
                          `${livebet.actor2?.slice(
                            0,
                            4,
                          )}...${livebet.actor2?.slice(-4)}`}
                    </p>
                  </div>
                </div>

                <div className="details">
                  <p id="title">{livebet.betName}</p>
                  <div className="time-left">
                    <p>Ends in</p>
                    <Countdown
                      endTime={
                        Number(livebet.startTimeStamp) +
                        Number(livebet.duration)
                      }
                    />
                  </div>
                </div>

                <div className="stake">
                  <span>
                    <p id="title">Stake:</p>
                    <p id="value">${Number(livebet.betAmount) / 1e18}</p>
                  </span>
                </div>

                <div className="cta">
                  <Link href={`/livebet/${livebet._betId}`}>
                    <button className="arrowButton" title="arrow">
                      <ArrowIcon />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-footer">
        
      </div>
    </main>
  );
};

export default LiveBets;
