import React, { useState, useEffect } from 'react';
import copyLink from '@/assets/images/icons/copy-link.svg';
import qrCode from '@/assets/images/QR Code.svg';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import QRCode from 'qrcode';
interface FundWalletModalProps {
  closeModal: () => void;
}

const FundWalletModal: React.FC<FundWalletModalProps> = ({ closeModal }) => {
  const [isCopied, setIsCopied] = useState(false); // State to track copy status
  const { address } = useAccount(); // Destructure the address from useAccount()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const copyToClipboard = async () => {
    if (!address) return; // Ensure the address exists before copying
    try {
      await navigator.clipboard.writeText(address); // Copy the address to clipboard
      setIsCopied(true); // Update state to show 'Copied!'
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Generate the QR code URL whenever the address changes
  useEffect(() => {
    if (address) {
      // console.log(`Wallet Address: ${address}`);
      QRCode.toDataURL(address, { width: 250 }, (err, url) => {
        if (err) {
          console.error('Failed to generate QR code: ', err);
          return;
        }
        setQrCodeUrl(url); // Set the generated QR code URL
      });
    }
  }, [address]);

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="title">Fund your wallet</div>
        <div className="share-link">
          <p>Only send USDC BASE SEPOLIA to this address</p>

          <div className="link-container">
            {/* Show the wallet address */}
            <div className="link">
              {address ? (
                <span>{address}</span>
              ) : (
                <span>No address connected</span>
              )}
            </div>
            <div className="btn" onClick={copyToClipboard}>
              {isCopied ? (
                <span>Copied!</span> // Show 'Copied!' text
              ) : (
                <Image src={copyLink} alt="Copy link" />
              )}
            </div>
          </div>
        </div>

        <div className="scan-qrcode">
          <p>Or Scan the QR Code</p>
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" /> // Render the QR code image
          ) : (
            <p>No QR code available</p>
          )}
        </div>

        <div className="close-modal-btn" onClick={closeModal}>
          close
          <Image src={closeIcon} alt="Close modal" />
        </div>
      </div>
    </div>
  );
};

export default FundWalletModal;
