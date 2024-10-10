import React, { useState } from 'react';
import copyLink from '@/assets/images/icons/copy-link.svg';
import qrCode from '@/assets/images/QR Code.svg';
import closeIcon from '@/assets/images/close.svg';
import Image from 'next/image';

interface ShareLinkModalProps {
  closeModal: () => void;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ closeModal }) => {
  const [isCopied, setIsCopied] = useState(false); // State to track copy status
  const link = 'https://kombat.kxy'; // The URL to be copied

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link); // Copy the link to clipboard
      setIsCopied(true); // Update state to show 'Copied!'
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="title">Invite your friends</div>
        <div className="share-link">
          <p>Share the link to your friends</p>

          <div className="link-container">
            <div className="link">{link}</div>
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
          <Image src={qrCode} alt="QR Code" />
        </div>

        <div className="close-modal-btn" onClick={closeModal}>
          close
          <Image src={closeIcon} alt="Close modal" />
        </div>
      </div>
    </div>
  );
};

export default ShareLinkModal;
