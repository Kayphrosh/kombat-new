import React from 'react';
import liveIcon from '@/assets/images/icons/live.png';
import plusIcon from '@/assets/images/icons/plus.svg';
import arrowIcon from '@/assets/images/icons/arrow-right.svg';
import Image from 'next/image';
import Link from 'next/link';
import NewKombatBtnBg from '@/assets/images/icons/new-kombat-btn-bg.svg';
import { liveBets } from './livebet-data'; // Import centralized data

const LiveBets = () => {
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
