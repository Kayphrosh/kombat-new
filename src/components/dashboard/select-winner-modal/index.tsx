import { KomatAbi } from '@/KombatAbi';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import React, { useState } from 'react';
import { ContractFunctionParameters } from 'viem';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';
import decideIcon from '@/assets/images/icons/decide.svg';
import router from 'next/router';
import { ButtonBgSvg } from './svg';

interface SelectWinnerProps {
  closeModal: () => void;
  id: string | string[] | undefined;
}

const SelectWinnerModal: React.FC<SelectWinnerProps> = ({ closeModal, id }) => {
  const [selectedOption, setSelectedOption] = useState<'won' | 'lost' | null>(
    null,
  );

  const handleOptionClick = (option: 'won' | 'lost') => {
    setSelectedOption(option);
  };

  const getTransaction = (): ContractFunctionParameters[] => {
    if (selectedOption === 'won') {
      return [
        {
          address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
          abi: KomatAbi,
          functionName: 'enterWin',
          args: [BigInt(id as string), true],
        },
      ];
    } else if (selectedOption === 'lost') {
      return [
        {
          address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
          abi: KomatAbi,
          functionName: 'enterWin',
          args: [BigInt(id as string), false],
        },
      ];
    } else {
      return [];
    }
  };

  return (
    <div className="select-winner-modal-container">
      <div className="modal-content">
        <div className="close-modal" onClick={closeModal}>
          close
          <Image src={closeIcon} alt="close" />
        </div>
        <div className="details">
          <h3>
            <Image src={decideIcon} alt="decide" />
            Decide the winner
          </h3>
          <div className="desc">
            <div className="title">Select the winner of the bet</div>
            <p>
              Note: If your choice coincides with the other kombatant, dispute
              settlement will done by done by third person.
            </p>
          </div>
          <div className="options">
            <div
              className={`option ${selectedOption === 'won' ? 'active' : ''}`}
              onClick={() => handleOptionClick('won')}
            >
              I won
            </div>
            <div
              className={`option ${selectedOption === 'lost' ? 'active' : ''}`}
              onClick={() => handleOptionClick('lost')}
            >
              I lost
            </div>
          </div>
        </div>
        <div className="confirm">
          <ButtonBgSvg />
          <Transaction
            chainId={84532}
            contracts={getTransaction()}
            onStatus={() => {}}
            onSuccess={() => {
              console.log('success');
              // router.push('/overview');
            }}
            className="transaction"
          >
            <TransactionButton
              text="Confirm Winner"
              className="tx-btton"
              disabled={!selectedOption}
            />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel className="status-label" />
              <TransactionStatusAction className="status-label" />
            </TransactionStatus>
          </Transaction>
        </div>
      </div>
    </div>
  );
};

export default SelectWinnerModal;
