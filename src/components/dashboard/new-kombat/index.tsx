import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../navbar';
import StepOne from './step-one';
import StepTwo from './step-two';
import FundWalletModal from '../fund-wallet-modal';
import ShareLinkModal from '../share-link-modal';
import USDCBalance from '@/components/USDCbalance';
import { useAccount } from 'wagmi';
import InsufficientFundToast from '@/components/toast';
import SuccessToast from '@/components/success-toast';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { KomatAbi } from '@/KombatAbi';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const NewKombatForm: React.FC<ToastProps> = () => {
  const [showInsufficientFundToast, setShowInsufficientFundToast] =
    useState(false);
  const [canProceedWithTransaction, setCanProceedWithTransaction] =
    useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isFundWalletModalVisible, setIsFundWalletModalVisible] =
    useState(false);
  const [isShareLinkModalVisible, setIsShareLinkModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    selectedOption: 'yes' as 'yes' | 'no',
    amount: '',
    challenger: '',
    date: '',
    time: '',
  });

  const [step, setStep] = useState(1);

  const [errors, setErrors] = useState({
    question: '',
    description: '',
    amount: '',
    challenger: '',
    date: '',
    time: '',
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (option: 'yes' | 'no') => {
    setFormData({ ...formData, selectedOption: option });
  };

  const validateStepOne = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
      isValid = false;
    } else {
      newErrors.question = '';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else {
      newErrors.description = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStepTwo = () => {
    let isValid = true;
    const newErrors = { ...errors };

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
      isValid = false;
    } else if (amount > balance) {
      newErrors.amount = 'Insufficient funds';
      isValid = false;
    } else {
      newErrors.amount = '';
    }

    if (!formData.challenger.trim()) {
      newErrors.challenger = 'Challenger is required';
      isValid = false;
    } else {
      newErrors.challenger = '';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
      isValid = false;
    } else {
      newErrors.date = '';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
      isValid = false;
    } else {
      newErrors.time = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (step === 1 && validateStepOne()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  const account = useAccount(); // Get the account address
  const [availableBalance, setAvailableBalance] = useState<number>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data } = useReadContract({
    address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5', // USDC contract address
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address as `0x${string}`],
  });

  const balance = Math.floor(Number(data?.toString()) / 1e18);
  // console.log('balance', balance);
  const handleBalanceUpdate = useCallback((balance: number) => {
    setAvailableBalance(balance);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStepTwo()) {
      const amount = parseFloat(formData.amount);

      if (amount > balance) {
        setToastMessage('Insufficient funds. Please top up your wallet!');
        setShowInsufficientFundToast(true);
        setTimeout(() => setShowInsufficientFundToast(false), 6000);
      } else {
        setToastMessage('Kombat created successfully!');
        router.push('/overview');
        console.log('formData', formData);
      }
    }
  };

  const handleCloseFundWalletModal = () => {
    setIsFundWalletModalVisible(false);
  };
  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleCloseShareLinkModal = () => {
    setIsShareLinkModalVisible(false);
    router.push('/overview');
  };

  const contracts = [
    {
      address: '0x4432fCE60bbC8dB0a34F722c7e5F89FB7F74a944',
      abi: KomatAbi,
      functionName: 'createBet',
      args: [
        [
          '0x4432fCE60bbC8dB0a34F722c7e5F89FB7F74a944',
          '0x4432fCE60bbC8dB0a34F722c7e5F89FB7F74a944',
        ],
        'test bet',
        BigInt(86400 / 2),
        '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
        '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
        BigInt(5000 * 1e18),
        false,
      ],
    },
  ];

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      console.log('LifecycleStatus', status);
      if (status.statusName === 'success') {
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          router.push('/overview');
        }, 3000);
      }
    },
    [router],
  );
  return (
    <div className="overview-container">
      <div className="wrapper">
        {step === 1 && (
          <StepOne
            formData={formData}
            handleChange={handleChange}
            handleOptionChange={handleOptionChange}
            nextStep={nextStep}
            errors={errors}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            handleChange={handleChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            availableBalance={balance}
            errors={errors}
            onStatus={handleOnStatus}
          />
        )}
      </div>

      {showInsufficientFundToast && (
        <InsufficientFundToast
          message={toastMessage}
          onClose={handleCloseToast}
        />
      )}

      {showSuccessToast && (
        <SuccessToast
          message={'Kombat created successfully!'}
          onClose={handleCloseToast}
        />
      )}

      {isFundWalletModalVisible && (
        <FundWalletModal closeModal={handleCloseFundWalletModal} />
      )}
      {isShareLinkModalVisible && (
        <ShareLinkModal closeModal={handleCloseShareLinkModal} />
      )}
    </div>
  );
};

export default NewKombatForm;
