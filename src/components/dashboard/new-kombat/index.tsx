import React, { useState } from 'react';
import { useRouter } from 'next/router'; // For navigation after closing ShareLinkModal
import Navbar from '../navbar';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Image from 'next/image';
import FundWalletModal from '../fund-wallet-modal';
import ShareLinkModal from '../share-link-modal';

const NewKombatForm: React.FC = () => {
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    amount: '',
    challenger: '',
  });

  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>('yes'); // Default to 'yes'

  // State to manage modal visibility
  const [isFundWalletModalVisible, setIsFundWalletModalVisible] =
    useState(false);
  const [isShareLinkModalVisible, setIsShareLinkModalVisible] = useState(false);

  // State for form validation errors
  const [errors, setErrors] = useState({
    question: '',
    description: '',
    amount: '',
    challenger: '',
  });

  // Available balance (assumed to be a number for comparison)
  const availableBalance = 120;

  const router = useRouter(); // For navigating to the /overview page

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error as the user types valid input
    if (name === 'question' && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, question: '' }));
    }

    if (name === 'description' && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
    }

    if (name === 'challenger' && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, challenger: '' }));
    }

    if (name === 'amount') {
      const amount = parseFloat(value);
      if (!isNaN(amount) && amount >= 5) {
        setErrors((prevErrors) => ({ ...prevErrors, amount: '' }));
      }
    }
  };

  const handleOptionChange = (option: 'yes' | 'no') => {
    setSelectedOption(option);
  };

  const validateForm = () => {
    const newErrors = {
      question: '',
      description: '',
      amount: '',
      challenger: '',
    };
    let isValid = true;

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    if (!formData.challenger.trim()) {
      newErrors.challenger = 'Challenger is required';
      isValid = false;
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 5) {
      newErrors.amount = 'Amount must be at least $5';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    // Convert the amount to a number for comparison
    const amount = parseFloat(formData.amount);

    // Check if the inputted amount exceeds the available balance
    if (amount > availableBalance) {
      // Show the FundWalletModal
      setIsFundWalletModalVisible(true);
      setIsShareLinkModalVisible(false);
    } else {
      // Show the ShareLinkModal
      setIsFundWalletModalVisible(true);
      setIsShareLinkModalVisible(true);
    }
  };

  // Handle closing the FundWalletModal and stay on the same page
  const handleCloseFundWalletModal = () => {
    setIsFundWalletModalVisible(false);
  };

  // Handle closing the ShareLinkModal and redirect to /overview
  const handleCloseShareLinkModal = () => {
    setIsShareLinkModalVisible(false);
    router.push('/invite-friends');
  };

  return (
    <div className="overview-container">
      <Navbar />

      <div className="wrapper">
        <div className="start-new-kombat-content">
          <h2>Start new kombat</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>What is the kombat details</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Kombat question"
              />
              {errors.question && (
                <span className="error-message">{errors.question}</span>
              )}
            </div>
            <div className="form-group">
              <label>Enter the description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label>Select an option</label>
              <div className="options">
                <div
                  className={`option ${
                    selectedOption === 'yes' ? 'active' : ''
                  }`}
                  onClick={() => handleOptionChange('yes')}
                >
                  Yes
                </div>
                <div
                  className={`option ${
                    selectedOption === 'no' ? 'active' : ''
                  }`}
                  onClick={() => handleOptionChange('no')}
                >
                  No
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="amount">
                <label>Kombat Amount $</label>
                <div className="available-balance">${availableBalance}</div>
              </div>

              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <span className="error-message">{errors.amount}</span>
              )}
            </div>

            <div className="form-group">
              <label>Who are you challenging?</label>
              <input
                type="text"
                name="challenger"
                value={formData.challenger}
                onChange={handleChange}
                placeholder="Enter challenger wallet address"
              />
              {errors.challenger && (
                <span className="error-message">{errors.challenger}</span>
              )}
            </div>
            <button type="submit">
              <div>Start Kombat</div>
              <Image src={buttonBg} alt="" />
            </button>
          </form>
        </div>
      </div>

      {/* Conditional rendering of modals */}
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
