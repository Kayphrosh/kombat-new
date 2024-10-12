import React from 'react';
import backIcon from '@/assets/images/icons/back-icon.svg';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import errorIcon from '@/assets/images/icons/error.svg';
import Image from 'next/image';

interface StepTwoProps {
  formData: {
    amount: string;
    challenger: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: {
    amount: string;
    challenger: string;
  };
  availableBalance: number;
}


const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  handleChange,
  prevStep,
  handleSubmit,
  errors,
  availableBalance,
}) => {
  console.log('Available Balance:', availableBalance); // Add this line
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
            <div className="available-balance">
              ${availableBalance.toFixed(2)} USDC
            </div>
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

          <div className="duration">
            <input type="date" placeholder="1" />
            <input type="time" placeholder="12:00" />
          </div>
        </div>

        <button type="submit" id="submit-btn">
          <Image src={buttonBg} alt="" />
          <div> Submit</div>
        </button>
      </form>
    </div>
  );
};

export default StepTwo;
