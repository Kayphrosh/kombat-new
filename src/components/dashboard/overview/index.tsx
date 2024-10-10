import React from 'react';
import Navbar from '../navbar';
import liveIcon from '@/assets/images/icons/live.png';
import Image from 'next/image';
import LiveBets from './live-bets';

const Overview = () => {
  return (
    <div className="overview-container">
      <Navbar />

      <div className="overview-content">
        <div className="dashboard-stats">
          <div className="stats">
            <div className="title">
              Live kombats <Image src={liveIcon} alt="" />
            </div>
            <div className="value">04</div>
          </div>

          <div className="stats">
            <div className="title">Completed</div>
            <div className="value">04</div>
          </div>

          <div className="stats">
            <div className="title">Total Stake</div>
            <div className="value">$400</div>
          </div>
          <div className="stats">
            <div className="title">Won</div>
            <div className="value">$1,000</div>
          </div>
        </div>

        <LiveBets />
      </div>
    </div>
  );
};

export default Overview;
