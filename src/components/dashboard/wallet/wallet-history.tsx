import React from 'react';

const WalletHistory = () => {
  
  const walletHistory = [
    {
      id: 0,
      amount: '1234',
      transactionType: 'Withdrew',
      walletAddress: '0x34345..200',
      transactionTime: '2hrs ago',
    },
    {
      id: 1,
      amount: '1234',
      transactionType: 'Withdrew',
      walletAddress: '0x34345..200',
      transactionTime: '2hrs ago',
    },
    {
      id: 2,
      amount: '1234',
      transactionType: 'deposited',
      walletAddress: '0x34345..200',
      transactionTime: '2hrs ago',
    },
    {
      id: 3,
      amount: '1234',
      transactionType: 'withdrew',
      walletAddress: '0x34345..200',
      transactionTime: '2hrs ago',
    },
  ];

  const WithdrewIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 1.34708e-06L5.25 1.47821e-06L5.25 9L3.75 9L3.75 10.5L5.25 10.5L5.25 12L6.75 12L6.75 10.5L8.25 10.5L8.25 9L6.75 9L6.75 1.34708e-06ZM9.75 7.5L9.75 9L8.25 9L8.25 7.5L9.75 7.5ZM9.75 7.5L9.75 6L11.25 6L11.25 7.5L9.75 7.5ZM2.25 7.5L2.25 9L3.75 9L3.75 7.5L2.25 7.5ZM2.25 7.5L2.25 6L0.75 6L0.75 7.5L2.25 7.5Z"
        fill="#F4535A"
      />
    </svg>
  );

  const DepositedIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 12H6.75L6.75 3H8.25V1.5L6.75 1.5V0L5.25 0V1.5H3.75L3.75 3H5.25L5.25 12ZM2.25 4.5V3L3.75 3V4.5H2.25ZM2.25 4.5L2.25 6H0.75L0.75 4.5H2.25ZM9.75 4.5V3H8.25V4.5H9.75ZM9.75 4.5V6H11.25V4.5H9.75Z"
        fill="#65FC5D"
      />
    </svg>
  );

  return (
    <div className="transaction-history">
      {walletHistory.map((history) => {
        const isWithdrawal =
          history.transactionType.toLowerCase() === 'withdrew';
        return (
          <div className="transaction" key={history.id}>
            <div className="transaction-desc">
              <div className="icon">
                {isWithdrawal ? <WithdrewIcon /> : <DepositedIcon />}
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
