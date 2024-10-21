import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import liveIcon from '@/assets/images/icons/live.png';
import Image from 'next/image';
import LiveBets from './live-bets';
import History from './history';
import { getTotalLiveBets } from './live-bets/livebet-data';
import { PlusIcon, ButtonBg } from './live-bets/svg';
import {
  CornerSVGTopLeft,
  CornerSVGTopRight,
  CornerSVGBottomLeft,
  CornerSVGBottomRight,
  RectangleLeftSVG,
  RectangleRightSVG,
  StatBgOverview,
} from './SVGComponents';
import WonModal from '@/components/dashboard/won-modal';
import LostModal from '@/components/dashboard/lost-modal';
import Link from 'next/link';
import { useAccount, useReadContract } from "wagmi";
import { KomatAbi } from "@/KombatAbi";
type OverviewProps = {
  totalLiveBets: number;
  totalCompletedBets: number;
};

const Overview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');
  const [totalLiveBets, setTotalLiveBets] = useState<number>(0);
  const [totalCompletedBets, setTotalCompletedBets] = useState<number>(0);
  const [won, setWon] = useState("0");
  const [totalStake, setTotalStake] = useState("0");
  const account = useAccount();
  const { data: totaldespoited } = useReadContract({
    address: "0x6b89252fe6490ae1f61d59b7d07c93e45749eb62",
    abi: KomatAbi,
    functionName: "totalDepositedUser",
    args: [account.address as `0x${string}`],
  });

  const { data: totalWon } = useReadContract({
    address: "0x6b89252fe6490ae1f61d59b7d07c93e45749eb62",
    abi: KomatAbi,
    functionName: "totalWonUser",
    args: [account.address as `0x${string}`],
  });
  useEffect(() => {
    setTotalStake(String(Number(totaldespoited) / 1e18));
    setWon(String(Number(totalWon) / 1e18));
  }, [totaldespoited, totalWon]);



  const handleTabSwitch = (tab: 'live' | 'history') => {
    setActiveTab(tab);
  };

  return (
    <>
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
              <div className="title">
                Live kombats <Image src={liveIcon} alt="" />
              </div>
              <div className="value">{totalLiveBets}</div>
            </div>

            <div className="stats">
              <div className="title">Completed</div>
              <div className="value">{totalCompletedBets}</div>
            </div>

            <div className="stats">
              <div className="title">Total Stake</div>
              <div className="value">${totalStake}</div>
            </div>
            <div className="stats">
              <div className="title">Won</div>
              <div className="value">${won}</div>
            </div>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              <div
                className={`tab ${activeTab === 'live' ? 'tab-active' : ''}`}
                onClick={() => handleTabSwitch('live')}
                id="live-bet"
              >
                Live kombats <Image src={liveIcon} alt="" />
              </div>
              <div
                className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`}
                onClick={() => handleTabSwitch('history')}
              >
                History
              </div>
            </div>

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
          {activeTab === 'live' ? (
            <LiveBets setLiveBetsCount={setTotalLiveBets} />
          ) : (
            <History setCompletedBetsCount={setTotalCompletedBets} />
          )}
        </div>
      </div>
      {/* <WonModal /> */}
      {/* <LostModal /> */}
    </>
  );
};

export default Overview;
