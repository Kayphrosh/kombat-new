import React from 'react';
import Image from 'next/image';
import withdrew from '@/assets/images/icons/withdrew.svg';
const WalletHistory = () => {
  const walletHistory = [
    {
      id: 0,
      amount: '1234',
      transactionType: 'Withdrew',
      walletAddress: '0x34345...54541200',
      transactionTime: '2hrs ago',
    },
    {
      id: 0,
      amount: '1234',
      transactionType: 'Withdrew',
      walletAddress: '0x34345...54541200',
      transactionTime: '2hrs ago',
    },
    {
      id: 1,
      amount: '1234',
      transactionType: 'withdrew',
      walletAddress: '0x34345...54541200',
      transactionTime: '2hrs ago',
    },
    {
      id: 2,
      amount: '1234',
      transactionType: 'withdrew',
      walletAddress: '0x34345...54541200',
      transactionTime: '2hrs ago',
    },
  ];
  return (
    <div className="transaction-history">
      {walletHistory.map((history) => {
        return (
          <div className="transaction" key={history.id}>
            <div className="transaction-desc">
              <div className="icon">
                <Image src={withdrew} alt="" />
              </div>

              <div className="desc">
                <div className="wallet-amount">
                  <span>{history.transactionType}</span>
                  <span id="amount">${history.amount}</span>
                </div>

                <div className="transaction-time">
                  {history.transactionTime}
                </div>
              </div>
            </div>

            <div className="address">{history.walletAddress}</div>
          </div>
        );
      })}
    </div>
  );
};

export default WalletHistory;
