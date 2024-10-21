import React from 'react';

interface Market {
  id: string;
  endTime: string;
  title: string;
  tag: string;
  volume: string;
  option1: string;
  option2: string;
  totalBets: number;
  status: string;
  stake: number;
}

interface MarketCardProps {
  market: Market;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const getTagClassName = (tag: string) => {
    return `tag ${tag.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (

      <div className="market-card-container">
        <div className="top-container">
          <div className="duration">
            <span>Ends in </span>
            {market.endTime}
          </div>
          <div className={getTagClassName(market.tag)}>{market.tag}</div>
        </div>

        <div className="title">{market.title}</div>

        <div className="stake">
          <span>Stake</span>
          {market.stake}
        </div>

        <div className="options">
          <div className="option option1">{market.option1}</div>
          <div className="option option2">{market.option2}</div>
        </div>

        <div className="bottom-container">
          <div className="volume">
            <span>Volume:</span> {market.volume}
          </div>
          <div className="total-bets">{market.totalBets}</div>
        </div>
      </div>

  );
};
