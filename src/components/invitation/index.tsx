import React, { useCallback, useState } from 'react';
import logo from '@/assets/images/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Avatar from '@/assets/images/icons/avatar-2.png';
import timeIcon from '@/assets/images/icons/time-icon.svg';
import Navbar from '../dashboard/navbar';
import { KomatAbi } from '@/KombatAbi';
import { useAccount } from 'wagmi';
import { Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusLabel, TransactionStatusAction, LifecycleStatus } from '@coinbase/onchainkit/transaction';
import router from 'next/router';
import { ContractFunctionParameters } from 'viem';
import { erc20ABI } from '@/erc20ABI';
//0x4cF351F2667fdea44944C90802CbE25F89752Fec
const Invitation = () => {
  const betId = 0;
  const account = useAccount();
  const contracts = [
    {
      address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
      abi: erc20ABI,
      functionName: 'approve',
      args: ['0xf8c6136FEDc00E5b380D76Dda4A9232839aE25F6', Number(800) * 1e18],
    },
    {
      address: '0xef843d1CDC2e0b4e64e7BaeEea5015cd8A9A82a9',
      abi: KomatAbi,
      functionName: 'enterBet',
      args: [3],
    },
  ];

  const options = ['Yes', 'No'];
  const [activeOption, setActiveOption] = useState('Yes'); // Track active option
  const challengerAvatar = Avatar;
  const challengerUsername = 'kayphrosh';

  const handleAcceptKombat = () => {
    console.log('accept kombat');
  } 
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);


  return (
    <div className="overview-container">
      <Navbar />

      <div className="invitation-content">
        <div className="challenger-details">
          <Image src={challengerAvatar} alt="" />
          <div className="text">
            @{challengerUsername} is challenging you to a kombat
          </div>
        </div>

        <div className="combat-details">
          <div className="time">
            <div className="time-left">
              <Image src={timeIcon} alt="" />
              2d : 16h : 52m
            </div>

            <div className="stake">
              <div className="title">Stake</div>
              <div className="value">$200</div>
            </div>
          </div>

          <div className="details">
            <h3>Who will win the ballon?</h3>

            <div className="desc">
              <div className="title">Description</div>
              <p>
                The name of the ballon was found in the year 1892 with the most
                winer bee the goat of football Lionel Andre Messi.
              </p>
            </div>

            <div className="options-container">
              <div className="title">Options</div>

              <div className="options">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`option ${
                      activeOption === option ? 'active' : ''
                    }`} // Add 'active' class
                    onClick={() => setActiveOption(option)} // Set active option on click
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="">
            <button onClick={handleAcceptKombat}>
              <div>Accept Kombat</div> <Image src={buttonBg} alt="" />
          <Transaction
            chainId={84532}
            contracts={contracts as ContractFunctionParameters[]}
            onStatus={handleOnStatus}
            onSuccess={() => {
              console.log('success');
            }}
            onError={(err) => {console.log(err)}}
          >
            <TransactionButton text="Submit" className="tx-btton" />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel className="status-label" />
              <TransactionStatusAction className="status-label" />
            </TransactionStatus>
          </Transaction>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invitation;
