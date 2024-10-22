import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import backIcon from '@/assets/images/icons/back-icon.svg';
import timeIcon from '@/assets/images/icons/time-icon.svg';
import Image from 'next/image';
import Countdown from '../overview/live-bets/countdown';
import { useReadContract } from 'wagmi';
import { KomatAbi } from '@/KombatAbi';
import { useAccount } from 'wagmi';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import SelectWinnerModal from '../select-winner-modal';
import { useFirestore } from '@/components/Firebasewrapper';
import vsIcon from '@/assets/images/icons/vs.svg'; // default image

const BetOverview = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = router.query;
  const { getBet, getUsernameByAddress, getProfilePicture } = useFirestore();
  const { address: currentUserAddress } = useAccount();

  const [accounts, setAccounts] = useState<
    { userName: string; avatar: string; address: string }[]
  >([]);
  const [fbData, setFbData] = useState<any | null>(null);

  const getId = (id: string | string[] | undefined) => {
    if (id === undefined) {
      return '';
    } else {
      return id;
    }
  };

  const { data, isError, isLoading } = useReadContract({
    address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
    abi: KomatAbi,
    functionName: 'getBetDetails',
    args: [BigInt(getId(id) as string)],
  });

  // Fetch bet details from Firestore
  useEffect(() => {
    getBet(id as string).then((data) => {
      setFbData(data);
    });
  }, [getBet, id]);

  // Fetch usernames and avatars for actors
  useEffect(() => {
    if (data?.actors) {
      const fetchActorData = async () => {
        const accountsData = await Promise.all(
          data.actors.map(async (actor: string) => {
            const userName = (await getUsernameByAddress(actor)) || actor;
            const avatar = (await getProfilePicture(actor)) || vsIcon;
            return { userName, avatar, address: actor };
          }),
        );
        setAccounts(accountsData);
      };
      fetchActorData();
    }
  }, [data, getUsernameByAddress, getProfilePicture]);

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
              <button onClick={() => setIsModalOpen(true)}>
                <div>Declare Winner</div>
                <Image src={buttonBg} alt="Declare Winner" />
              </button>
            </div>
            <div className="details">
              <h3>{data?.betName}</h3>
              <div className="desc">
                <div className="title">Description</div>
                <p>{fbData?.description}</p>
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
