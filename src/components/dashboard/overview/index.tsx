import React from 'react';
import Navbar from '../navbar';
import liveIcon from '@/assets/images/icons/live.png';
import Image from 'next/image';
import LiveBets from './live-bets';
import { getTotalLiveBets } from './live-bets/livebet-data';
import {
  CornerSVGTopLeft,
  CornerSVGTopRight,
  CornerSVGBottomLeft,
  CornerSVGBottomRight,
  RectangleLeftSVG,
  RectangleRightSVG,
  StatBgOverview,
} from './SVGComponents';

const Overview: React.FC = () => {
  const totalLiveBets = getTotalLiveBets();
  return (
    <div className="overview-container">
      <Navbar />

      <div className="overview-content">
        <div className="dashboard-stats">
          <CornerSVGTopLeft className="corner-top-left" />
          <CornerSVGBottomLeft className="corner-bottom-left" />
          <CornerSVGBottomRight className="corner-bottom-right" />
          <CornerSVGTopRight className="corner-top-right" />

          <RectangleLeftSVG className="rectangle-left" />
          <RectangleRightSVG className="rectangle-right" />

          <div className="stats">
            {/* <StatBgOverview className="stat-bg-overview" /> */}
            <div className="title">
              Live kombats <Image src={liveIcon} alt="" />
            </div>
            <div className="value"> {totalLiveBets}</div>
          </div>

          <div className="stats">
            {/* <StatBgOverview className="stat-bg-overview" /> */}
            <div className="title">Completed</div>
            <div className="value">04</div>
          </div>

          <div className="stats">
            {/* <StatBgOverview className="stat-bg-overview" /> */}
            <div className="title">Total Stake</div>
            <div className="value">$400</div>
          </div>
          <div className="stats">
            {/* <StatBgOverview className="stat-bg-overview" /> */}
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
