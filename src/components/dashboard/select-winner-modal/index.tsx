import { KomatAbi } from '@/KombatAbi';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
  LifecycleStatus,
} from '@coinbase/onchainkit/transaction';
import React, { useCallback } from 'react';
import { ContractFunctionParameters } from 'viem';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';
import decideIcon from '@/assets/images/icons/decide.svg';
import router from 'next/router';
interface SelectWinnerProps {
  closeModal: () => void;
  id: string | string[] | undefined;
}
const SelectWinnerModal: React.FC<SelectWinnerProps> = ({ closeModal, id }) => {
  const wonTx = [
    {
      address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
      abi: KomatAbi,
      functionName: 'enterWin',
      args: [BigInt(id as string), true],
    },
  ];

  const lostTx = [
    {
      address: '0x6b89252fe6490ae1f61d59b7d07c93e45749eb62',
      abi: KomatAbi,
      functionName: 'enterWin',
      args: [BigInt(id as string), false],
    },
  ];
  // const handleOnStatus = useCallback((status: LifecycleStatus) => {
  //   console.log('LifecycleStatus', status);
  //   // console.log('BetId', betId);
  //   // writeFireBaseData(betId);
  // }, []);

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

          <div className="cta">
            <button title="I Won">
              <div id='title'> I won</div>
              <Transaction
                chainId={84532}
                contracts={wonTx as ContractFunctionParameters[]}
                onStatus={()=>{}}
                onSuccess={() => {
                  console.log('success');
                  // router.push('/overview');
                }}
              >
                <TransactionButton text="I won" className="tx-btton" />
                <TransactionSponsor />
                <TransactionStatus>
                  <TransactionStatusLabel className="status-label" />
                  <TransactionStatusAction className="status-label" />
                </TransactionStatus>
              </Transaction>
            </button>
            <button title="I Lost">
              <div id='title'>I Lost</div>
              <Transaction
                chainId={84532}
                contracts={lostTx as ContractFunctionParameters[]}
                onStatus={()=>{}}
                onSuccess={() => {
                  console.log('success');
                  router.push('/overview');
                }}
              >
                <TransactionButton text="I Lost" className="tx-btton" />
                <TransactionSponsor />
                <TransactionStatus>
                  <TransactionStatusLabel className="status-label" />
                  <TransactionStatusAction className="status-label" />
                </TransactionStatus>
              </Transaction>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectWinnerModal;
