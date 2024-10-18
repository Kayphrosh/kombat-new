import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Navbar from '../navbar';
import backIcon from '@/assets/images/icons/back-icon.svg';
import timeIcon from '@/assets/images/icons/time-icon.svg';
import Image from 'next/image';
import { liveBets } from '@/components/dashboard/overview/live-bets/livebet-data';
import ShareLinkModal from '../share-link-modal';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Countdown from '../overview/live-bets/countdown';
import { useReadContract } from 'wagmi';
import { KomatAbi } from '@/KombatAbi';
import { useAccount } from 'wagmi';


const BetOverview = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = router.query;
  console.log('id', id);

  const account = useAccount();
  const { data, isError, isLoading } = useReadContract({
    address: '0x837e01e02Da39A1271194D02018e70D1601c2F7a', // USDC contract address
    abi: KomatAbi,
    functionName: 'getBetDetails',
    args: [BigInt(id as string)],
  });
  const liveBet = {};
  console.log('data', data);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [activeOption, setActiveOption] = useState('Yes');
  const options = ['Yes', 'No'];

  // Ensure hooks are called before any conditional returns
  if (!liveBet) {
    return <div>Bet not found</div>;
  }


  return (
    <div className="new-combat-container">
      <Navbar />

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
                {/* {liveBet.timeLeft} */}
                <Countdown endTime={Number(data?.endTimeStamp)} />
              </div>

              <button onClick={openModal}>
                <div>Declare Winner</div>
                <Image src={buttonBg} alt="Invite Friends" />
              </button>
            </div>
            <div className="details">
              <h3>Who will win the ballon?</h3>

              <div className="desc">
                <div className="title">Description</div>
                <p>{data?.betName}</p>
              </div>

              <div className="options-container">
                <div className="title">Options</div>

                <div className="options">
                  {options.map((option, index) => (
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
            <div className="stake">
              <div className="title">Your Stake</div>
              <div className="value">{data?.amount}</div>
            </div>
          </div>

          <div className="combat-warriors-container">
            {/* <div className="combat-warriors">
              {warriors.map((warrior) => (
                <div className="warrior" key={warrior.id}>
                  <div className="user-desc">
                    <Image src={warrior.avatar} alt={warrior.userName} />
                    <span>{warrior.userName}</span>
                  </div>
                  <div className="amount">${warrior.amount}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      {isModalOpen && <ShareLinkModal closeModal={closeModal} />}
    </div>
  );
};

export default BetOverview;
