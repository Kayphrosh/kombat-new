import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.svg';
import avatarPlaceholder from '@/assets/images/icons/avatar-placeholder.png';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import { useRouter } from 'next/router'; // Import useRouter
import { useAccount } from 'wagmi';
import { useFirestore } from '../Firebasewrapper';
import SuccessToast from '../success-toast';

const Identity: React.FC = () => {
  // State for storing username and avatar
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const account = useAccount();
  const { createUser, uploadProfilePicture, isUsernameTaken } = useFirestore();
  const router = useRouter(); // Initialize useRouter

  // Handle username input
  const handleUsernameChange = async () => {
    try {
      const usernameExists = await isUsernameTaken(username);
      if (usernameExists) {
        console.error('Username is already taken');
        // setError('Username is already taken');
        return;
      }

      await createUser(account.address as string, username);

      if (avatar) {
        const imageUrl = await uploadProfilePicture(
          avatar,
          account.address as string,
        );
        console.log('Profile picture uploaded at:', imageUrl);
      }

      console.log('User created successfully');

      // Show toast and redirect to overview
      setShowToast(true);
      router.push('/overview'); // Redirect to the overview page
    } catch (err) {
      console.error(err);
      setError(err as string);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
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
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="Enter your username"
            />
            {error && <div className="error">{error.toString()}</div>}
          </div>

          <div className="input-img">
            <label htmlFor="avatar-upload">Choose your Avatar</label>
            <div className="upload-image">
              {avatar ? (
                <Image
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar"
                  width={100}
                  height={100}
                />
              ) : (
                <Image
                  src={avatarPlaceholder}
                  alt="Avatar"
                  width={100}
                  height={100}
                />
              )}
              <button>
                <label htmlFor="avatar-upload">Upload your image</label>
              </button>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <button className="cta" onClick={() => handleUsernameChange()}>
          <div>Enter Arena</div>
          <Image src={buttonBg} alt="Button Background" />
        </button>
      </div>

      {showToast && ( 
        <SuccessToast
          message="User Identity created successfully"
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};

export default Identity;
