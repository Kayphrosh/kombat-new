import React, { useCallback, useState, useEffect } from 'react';
import backIcon from '@/assets/images/icons/back-icon.svg';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import errorIcon from '@/assets/images/icons/error.svg';
import Image from 'next/image';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
  LifecycleStatus,
} from '@coinbase/onchainkit/transaction';
import { KomatAbi } from '@/KombatAbi';
import { useAccount } from 'wagmi';
import { ContractFunctionParameters, Hex } from 'viem';
import { erc20ABI } from '@/erc20ABI';
import { hexToNumber } from 'viem';
import { useFirestore, BetData } from '@/components/Firebasewrapper';
import router from 'next/router';

interface StepTwoProps {
  formData: {
    question: string;
    description: string;
    selectedOption: 'yes' | 'no';
    amount: string;
    challenger: string;
    date: string;
    time: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: {
    amount: string;
    challenger: string;
    date: string;
    time: string;
  };
  availableBalance: number;
  onStatus: (status: LifecycleStatus) => void;
  //  canProceedWithTransaction={canProceedWithTransaction}
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  handleChange,
  prevStep,
  handleSubmit,
  errors,
  availableBalance,
  onStatus,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [unixTime, setUnixTime] = useState<number>(86400);
  const [dateTimeError, setDateTimeError] = useState<string>('');
  const [betId, setBetId] = useState<number | null>(null);
  const { createBet } = useFirestore();

  useEffect(() => {
    validateDateTime();
  }, [date, time]);

  const validateDateTime = () => {
    if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}:00`);
      const currentDateTime = new Date();

      if (selectedDateTime <= currentDateTime) {
        setDateTimeError('Selected time must be in the future');
        setUnixTime(0);
      } else {
        setDateTimeError('');
        const unix = Math.floor(selectedDateTime.getTime() / 1000);
        setUnixTime(unix);
      }
    } else {
      setDateTimeError('');
      setUnixTime(0);
    }
  };

  const account = useAccount();
  const contracts = [
    {
      address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
      abi: erc20ABI,
      functionName: 'approve',
      args: [
        '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
        Number(formData.amount) * 1e18,
      ],
    },
    {
      address: '0x6b89252fe6490AE1F61d59b7D07C93E45749eb62',
      abi: KomatAbi,
      functionName: 'createBet',
      args: [
        [account.address, formData.challenger],
        formData.question,
        unixTime - Math.floor(Date.now() / 1000),
        account.address,
        '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
        Number(formData.amount) * 1e18,
        false,
      ],
    },
  ];

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      console.log('LifecycleStatus', status);
      if (status.statusName === 'success') {
        const logs = status.statusData.transactionReceipts[0].logs;
        const filteredLogs = logs.filter((l) => {
          return (
            l.address ===
            ('0x6b89252fe6490ae1f61d59b7d07c93e45749eb62' as `0x${string}`)
          );
        });
        console.log('filtered logs', filteredLogs);
        const betId = filteredLogs[0].topics[1];
        console.log('BetId', hexToNumber(betId as Hex));
        console.log('logs', logs);
        setBetId(hexToNumber(betId as Hex));
        writeFireBaseData();
      }
      onStatus(status);
    },
    [onStatus],
  );

  const writeFireBaseData = async () => {
    const betData: BetData = {
      actor1: account.address as string,
      actor2: formData.challenger as string,
      description: formData.description,
      option: formData.selectedOption,
      amount: Number(formData.amount),
    };
    await createBet(Number(betId), betData);
  };

  return (
    <div
      onSubmit={handleSubmit}
      className="start-new-kombat-content start-new-kombat-step-two"
    >
      <button className="back-btn" type="button" onClick={prevStep}>
        <Image src={backIcon} alt="arrow-left" />
        Back
      </button>
      <form id="step-two-form">
        <div className="form-group">
          <div className="amount">
            <label>
              Kombat Amount
              {errors.amount && (
                <span className="error-icon">
                  <Image src={errorIcon} alt="" />
                </span>
              )}
            </label>
            <div className="available-balance">${availableBalance} USDC</div>
          </div>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </div>

        <div className="form-group">
          <label>
            Who are you challenging?
            {errors.challenger && (
              <span className="error-icon">
                <Image src={errorIcon} alt="" />
              </span>
            )}
          </label>
          <input
            type="text"
            name="challenger"
            value={formData.challenger}
            onChange={handleChange}
            placeholder="Enter challenger wallet address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Time Bet Would End</label>
          {dateTimeError && (
            <span className="error-message">{dateTimeError}</span>
          )}
          <div className="duration">
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              min={new Date().toISOString().split('T')[0]}
              placeholder="Select date"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              placeholder="Select time"
            />
          </div>
        </div>

        <button
          id="submit-btn"
          onClick={() => {
            console.log(unixTime);
          }}
          type="button"
          disabled={!!dateTimeError || unixTime === 0}
        >
          <Image src={buttonBg} alt="" />
          <div> Submit</div>
          <Transaction
            chainId={84532}
            contracts={contracts as ContractFunctionParameters[]}
            onStatus={handleOnStatus}
            onSuccess={() => {
              writeFireBaseData();
              console.log('success');
              router.push('/overview');
            }}
          >
            <TransactionButton text="Submit" className="tx-btton" />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel className="status-label" />
              <TransactionStatusAction className="status-label" />
            </TransactionStatus>
          </Transaction>
        </button>
      </form>
    </div>
  );
};

export default StepTwo;
