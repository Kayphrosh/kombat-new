import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.svg';
import avatarPlaceholder from '@/assets/images/icons/avatar-placeholder.png';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Link from 'next/link';

const Identity: React.FC = () => {
  // State for storing username and avatar
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Handle username input
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // Handle avatar upload
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setAvatar(avatarUrl);
    }
  };

  return (
    <div className="overview-container">
      <div className="navbar-container">
        <div className="navbar-content">
          <Image src={logo} alt="Logo" />
        </div>
      </div>

      <div className="identity-container">
        <div className="title">Your identity on the arena</div>

        <div className="identity-form">
          <div className="input">
            <label htmlFor="username">What is your Username?</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="input-img">
            <label htmlFor="avatar-upload">Choose your Avatar</label>
            <div className="upload-image">
              <Image
                src={avatar || avatarPlaceholder}
                alt="Avatar"
                width={100}
                height={100}
              />
              <button>
                <label htmlFor="avatar-upload">Upload your image</label>
              </button>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <Link href="/overview">
          <button className="cta">
            <div>Enter Arena</div>
            <Image src={buttonBg} alt="Button Background" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Identity;
