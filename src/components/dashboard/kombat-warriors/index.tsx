import React from 'react';
import Image from 'next/image';
import Avatar from '@/assets/images/icons/avatar-2.png';
import linkIcon from '@/assets/images/icons/copy-link.svg';
export interface Warriors {
  id?: string;
  avatar?: string;
  userName?: 'You';
  amount?: string;
  challenger?: string;
}

const KombatWarriors: React.FC<{ warriors: Warriors }> = ({ warriors }) => {
  return (
    <div className="combat-warriors">
      <div className="warrior">
        <div className="user-desc">
          <Image src={Avatar} alt="" />
          <span>{warriors?.challenger}</span>
        </div>
        <div className="amount">${warriors?.amount}</div>
      </div>

      <div className="warrior">
        <div className="user-desc">
          <Image src={Avatar} alt="" />
          <span>{warriors?.userName}</span>
        </div>
        <div className="amount">${warriors?.amount}</div>
      </div>
    </div>
  );
};

export default KombatWarriors;
