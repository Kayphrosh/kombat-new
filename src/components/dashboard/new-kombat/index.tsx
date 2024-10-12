import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../navbar';
import StepOne from './step-one';
import StepTwo from './step-two';
import FundWalletModal from '../fund-wallet-modal';
import ShareLinkModal from '../share-link-modal';
import USDCBalance from '@/components/USDCbalance';
import { useAccount } from 'wagmi';
import Toast from '@/components/toast';
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

interface ToastProps {
  message: string;
  onClose: () => void;
}

const NewKombatForm: React.FC<ToastProps> = () => {
  const [isFundWalletModalVisible, setIsFundWalletModalVisible] =
    useState(false);
  const [isShareLinkModalVisible, setIsShareLinkModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    selectedOption: 'yes' as 'yes' | 'no',
    amount: '',
    challenger: '',
  });

  const [step, setStep] = useState(1);

  const [errors, setErrors] = useState({
    question: '',
    description: '',
    amount: '',
    challenger: '',
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
    if (isNaN(amount) || amount < 5) {
      newErrors.amount = 'Amount must be at least $5';
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
  // const { address: account } = useAccount(); // Get the account address
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const { address: account } = useAccount();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleBalanceUpdate = useCallback((balance: number) => {
    setAvailableBalance(balance);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStepTwo()) {
      const amount = parseFloat(formData.amount);

      if (amount > availableBalance) {
        setToastMessage('Insufficient funds. Please top up your wallet!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 6000);
      } else {
        setIsShareLinkModalVisible(true);
      }
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateStepTwo()) {
  //     const amount = parseFloat(formData.amount);
  //     const availableBalance = 120; // This should be dynamically set based on user's actual balance

  //     if (amount > availableBalance) {
  //       setIsFundWalletModalVisible(true);
  //     } else {
  //       setIsShareLinkModalVisible(true);
  //     }
  //   }
  // };

  const handleCloseFundWalletModal = () => {
    setIsFundWalletModalVisible(false);
  };
  const handleCloseToast = () => {
    setShowToast(false); // Close the toast when the button is clicked or the toast time expires
  };

  const handleCloseShareLinkModal = () => {
    setIsShareLinkModalVisible(false);
    router.push('/invite-friends');
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

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  return (
    <div className="overview-container">
      <Navbar />
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
            availableBalance={availableBalance}
            errors={errors}
          />
        )}
      </div>

      {showToast && <Toast message={toastMessage} onClose={handleCloseToast} />}

      {/* {account && (
        <USDCBalance
          walletAddress={account}
          onBalanceUpdate={handleBalanceUpdate}
        />
      )} */}
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
