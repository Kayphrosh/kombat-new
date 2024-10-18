import React from 'react';
import Image from 'next/image';
import errorIcon from '@/assets/images/icons/error.svg'
interface StepOneProps {
  formData: {
    question: string;
    description: string;
    selectedOption: 'yes' | 'no';
    amount: string;
    challenger: string;
    date: string;
    time: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleOptionChange: (option: 'yes' | 'no') => void;
  nextStep: () => void;
  errors: {
    question: string;
    description: string;
  };
}

const StepOne: React.FC<StepOneProps> = ({
  formData,
  handleChange,
  nextStep,
  handleOptionChange,
  errors,
}) => {
  return (
    <div className="start-new-kombat-content">
      <h2>Start new kombat</h2>
      <form>
        <div className="form-group">
          <label>
            What is the kombat question?{' '}
            {errors.question && (
              <span className="error-icon">
                <Image src={errorIcon} alt="" />
              </span>
            )}
          </label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="Kombat question"
          />
        </div>

        <div className="form-group">
          <label>
            Enter the description{' '}
            {errors.description && (
              <span className="error-icon">
                <Image src={errorIcon} alt="" />
              </span>
            )}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        <div className="form-group">
          <label>Select an option</label>
          <div className="options">
            <div
              className={`option ${
                formData.selectedOption === 'yes' ? 'active' : ''
              }`}
              onClick={() => handleOptionChange('yes')}
            >
              Yes
            </div>
            <div
              className={`option ${
                formData.selectedOption === 'no' ? 'active' : ''
              }`}
              onClick={() => handleOptionChange('no')}
            >
              No
            </div>
          </div>
        </div>

        <button type="button" id="next" onClick={nextStep}>
          Next
        </button>
      </form>
    </div>
  );
};

export default StepOne;
