import React, { useState } from 'react';
import logo from '@/assets/images/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Avatar from '@/assets/images/icons/avatar-2.png';
import timeIcon from '@/assets/images/icons/time-icon.svg';
import Navbar from '../dashboard/navbar';

const Invitation = () => {
  const options = ['Yes', 'No'];
  const [activeOption, setActiveOption] = useState('Yes'); // Track active option
  const challengerAvatar = Avatar;
  const challengerUsername = 'kayphrosh';

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
            <button>
              <div>Accept Kombat</div> <Image src={buttonBg} alt="" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invitation;
