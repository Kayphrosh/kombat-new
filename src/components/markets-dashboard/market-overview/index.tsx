'use client';
import React from 'react';
import MarketNavbar from '@/components/markets-dashboard/market-nav';
import liveIcon from '@/assets/images/icons/live.png';
import searchIcon from '@/assets/images/icons/search.svg';
import Image from 'next/image';
import { MarketCard } from '../market-card';

const MarketOverview = () => {
  const markets = [
    {
      id: 1,
      tag: 'Politics',
      title: 'Who will win US Election',
      volume: '3,330',
      option1: 'Biden',
      option2: 'Trump',
      endTime: '10/20/2024',
      status: 'Live',
      totalBets: 100,
      stake: 12000,
    },
    {
      id: 2,
      tag: 'Crypto',
      title: 'Who will win US Election',
      volume: '3,330',
      option1: 'Biden',
      option2: 'Trump',
      endTime: '10/20/2024',
      status: 'Live',
      totalBets: 100,
      stake: 12000,
    },
    {
      id: 3,
      tag: 'Sport',
      title: 'Who will win US Election',
      volume: '3,330',
      option1: 'Biden',
      option2: 'Trump',
      endTime: '10/20/2024',
      status: 'Live',
      totalBets: 100,
      stake: 12000,
    },

    {
      id: 4,
      tag: 'Politics',
      title: 'Who will win US Election',
      volume: '3,330',
      option1: 'Biden',
      option2: 'Trump',
      endTime: '10/20/2024',
      status: 'Live',
      totalBets: 100,
      stake: 12000,
    },
    {
      id: 5,
      tag: 'Crypto',
      title: 'Who will win US Election',
      volume: '3,330',
      option1: 'Biden',
      option2: 'Trump',
      endTime: '10/20/2024',
      status: 'Live',
      totalBets: 100,
      stake: 12000,
    },
    {
      id: 6,
      tag: 'Sport',
      title: 'Who will win US Election',
      volume: '3,330',
      option1: 'Biden',
      option2: 'Trump',
      endTime: '10/20/2024',
      status: 'Live',
      totalBets: 100,
      stake: 12000,
    },
  ];
  return (
    <div className="market-overview-container overview-container">

      <div className="market-overview-content">
        <div className="bar-container">
          <div className="overview-tabs">
            <div className="tab tab-live tab-active">
              Live <Image src={liveIcon} alt="" />
            </div>
            <div className="tab">Sports</div>
            <div className="tab">Crypto</div>
            <div className="tab">Politics</div>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <Image src={searchIcon} alt="Search" />
          </div>
        </div>

        <div className="markets">
          {markets.map((market) => (
            <MarketCard
              key={market.id.toString()}
              market={{ ...market, id: market.id.toString() }}
            />
          ))}
        </div>

        <div className="bar-container coming-soon">
          <div> COMING SOON!</div>
          <div>COMING SOON!</div>
          <div> COMING SOON!</div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
