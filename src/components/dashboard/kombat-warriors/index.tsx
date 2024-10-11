import React from 'react';
import Image from 'next/image';
import Avatar from '@/assets/images/icons/avatar-2.png';
import linkIcon from '@/assets/images/icons/copy-link.svg';
const KombatWarriors = () => {
  const warriors = [
    {
      id: 0,
      avatar: Avatar,
      userName: 'You',
      amount: '1200',
    },
    {
      id: 1,
      avatar: Avatar,
      userName: 'Grammyboyyy',
      amount: '1200',
    },
    {
      id: 2,
      avatar: Avatar,
      userName: 'Kayphrosh',
      amount: '1200',
    },

  ];
  return (
    <div className="combat-warriors">

      {warriors.map((warrior) => {
        return (
          <div className='warrior' key={warrior.id}>
            <div className="user-desc">
              <Image src={warrior.avatar} alt="" />
              <span>{warrior.userName}</span>
            </div>
            <div className="amount">${warrior.amount}</div>
          </div>
        );
      })}
    </div>
  );
};

export default KombatWarriors;
