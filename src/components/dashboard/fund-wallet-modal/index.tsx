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
  const [isCopied, setIsCopied] = useState(false);
  const { address } = useAccount();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const copyToClipboard = async () => {
    if (!address) return;
    
    const copyText = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use the Clipboard API when available (HTTPS only)
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers and HTTP
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
        return Promise.resolve();
      }
    };

    try {
      await copyText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    if (address) {
      QRCode.toDataURL(address, { width: 250 }, (err, url) => {
        if (err) {
          console.error('Failed to generate QR code: ', err);
          return;
        }
        setQrCodeUrl(url);
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
            <div className="link">
              {address ? (
                <span>{address}</span>
              ) : (
                <span>No address connected</span>
              )}
            </div>
            <div className="btn" onClick={copyToClipboard}>
              {isCopied ? (
                <span>Copied!</span>
              ) : (
                <Image src={copyLink} alt="Copy link" />
              )}
            </div>
          </div>
        </div>

        <div className="scan-qrcode">
          <p>Or Scan the QR Code</p>
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" />
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
