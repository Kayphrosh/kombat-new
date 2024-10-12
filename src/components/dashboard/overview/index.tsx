import React from 'react';
import Navbar from '../navbar';
import liveIcon from '@/assets/images/icons/live.png';
import Image from 'next/image';
import LiveBets from './live-bets';
import cornerTopLeft from '@/assets/images/icons/corner-top-left.svg';
import cornerBottomRight from '@/assets/images/icons/corner-bottom-right.svg';
import cornerTopRight from '@/assets/images/icons/corner-top-right.svg';
import cornerBottomLeft from '@/assets/images/icons/corner-bottom-left.svg';
import rectangle from '@/assets/images/icons/rectangle.svg';
import rectangleRight from '@/assets/images/icons/rectangle-right.svg';
const Overview = () => {
  return (
    <div className="overview-container">
      <Navbar />

      <div className="overview-content">
        <div className="dashboard-stats">
          <Image src={cornerTopLeft} alt="" className="corner-top-left" />
          <Image
            src={cornerBottomRight}
            alt=""
            className="corner-bottom-right"
          />
          <Image src={cornerTopRight} alt="" className="corner-top-right" />
          <Image src={cornerBottomLeft} alt="" className="corner-bottom-left" />

          <Image src={rectangle} alt="" className="rectangle-left" />
          <Image src={rectangleRight} alt="" className="rectangle-right" />

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
