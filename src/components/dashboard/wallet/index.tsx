import React, { useCallback, useState, useEffect } from 'react';
import Navbar from '../navbar';
import WalletHistory from './wallet-history';
import avatar from '@/assets/images/icons/profile-pics.svg';
import buttonBg from '@/assets/images/icons/button-bg.svg';
import Image from 'next/image';
import FundWalletModal from '../fund-wallet-modal';
import WithdrawalModal from '../withdrawal-modal';
import USDCBalance from '@/components/USDCbalance';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
  LifecycleStatus,
} from '@coinbase/onchainkit/transaction';
import { ContractFunctionParameters } from 'viem';
import { erc20ABI } from '@/erc20ABI';
import { useAccount } from 'wagmi';
import { useFirestore } from '@/components/Firebasewrapper';

const Walllet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);
  const openWithdrawalModal = () => setIsWithdrawalModalOpen(true);
  // const [address, setAddress] = useState('');
  const account = useAccount();
  const { address } = useAccount();

  const VsIconDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M30.8898 2.72998L30.1304 3.79873L33.6554 6.29623L34.4148 5.22373L30.8898 2.72998ZM22.6398 3.20248L24.9085 7.45498L25.0773 7.57592L26.4648 3.79217L22.6398 3.20248ZM28.0398 4.38654L26.5023 8.58654L30.3179 11.2875L33.6273 8.33061C33.5429 8.27623 33.4491 8.21904 33.3648 8.1581L28.0398 4.38654ZM5.6082 4.55248L6.62445 8.84904L9.40227 9.09279L9.65539 6.31498L5.6082 4.55248ZM44.146 7.06967C43.621 7.51123 43.0023 7.87498 42.3179 8.17029C42.7866 12.525 40.9398 15.9937 38.0804 18.4594C35.596 20.6062 32.371 22.0594 29.1741 22.95C28.9398 23.4 28.7054 23.8125 28.4804 24.1781C32.371 24.6844 37.2179 22.1906 40.5929 18.5531C42.4491 16.5562 43.8554 14.25 44.446 12.0656C44.9335 10.2469 44.8866 8.55748 44.146 7.06967ZM11.2116 7.88623L10.9304 10.9312L7.89758 10.6594L29.1366 36.0656L31.0116 34.5L32.446 33.3L11.2116 7.88623ZM40.6866 8.72717C40.2929 8.82092 39.8898 8.91467 39.4866 8.98029C38.0898 9.21467 36.6648 9.27092 35.4085 9.00842L31.5648 12.4406C31.9398 13.0969 32.0335 13.9125 31.9866 14.7375C31.9304 15.9187 31.5835 17.2406 31.1148 18.5719C30.8335 19.35 30.5241 20.1281 30.1866 20.8781C32.7085 20.0156 35.1179 18.7875 36.9835 17.1844C39.4398 15.0469 40.9679 12.3469 40.6866 8.72717ZM25.6866 10.0687L20.8866 16.8375L23.7554 20.2594L29.2116 12.5625L25.6866 10.0687ZM16.2929 23.325L3.23633 41.7375L6.75477 44.2312L19.1523 26.7469L16.2929 23.325ZM38.1366 30.75L25.621 41.2031L27.421 43.3687L39.9366 32.9062L38.1366 30.75ZM36.421 38.0531L33.1116 40.8094L36.8335 45.2719L40.1429 42.5156L36.421 38.0531Z' fill='white'/%3E%3C/svg%3E";
  const [userAvatar, setUserAvatar] = useState<string>(VsIconDataUrl);
  const withdrawAmount = 100;
  const withdrawTo = '0x4cF351F2667fdea44944C90802CbE25F89752Fec';
  const contracts = [
    {
      address: '0xaf6264B2cc418d17F1067ac8aC8687aae979D5e5',
      abi: erc20ABI,
      functionName: 'transfer',
      args: [withdrawTo, withdrawAmount],
    },
  ];
  const { getProfilePicture, checkUserExists, getAddressByUsername } =
    useFirestore();


  useEffect(() => {
    if (address) {
      getProfilePicture(address)
        .then((profilePicture) => {
          setUserAvatar(profilePicture || VsIconDataUrl);
        })
        .catch((error) => {
          console.error(
            `Error fetching profile picture for ${address}:`,
            error,
          );
          setUserAvatar(VsIconDataUrl);
        });
    }
  }, [address, getProfilePicture]);
  const userName = 'Kendrick';
  const totalAmount = '12393';

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  
  return (
    <div className="overview-container">
      {/* <Navbar /> */}

      <div className="wallet-content">
        <div className="wallet-balance-container">
          <div className="wallet-bg">
            {/* <svg
              width="100%"
              height="253"
              viewBox="0 0 368 203"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_i_1960_135682)">
                <rect width="368" height="202.233" rx="16" fill="#0A0D15" />
                <rect
                  x="0.475548"
                  y="0.475548"
                  width="367.049"
                  height="201.282"
                  rx="15.5245"
                  stroke="white"
                  stroke-opacity="0.15"
                  stroke-width="0.951096"
                />
              </g>
              <defs>
                <filter
                  id="filter0_i_1960_135682"
                  x="0"
                  y="0"
                  width="368"
                  height="202.234"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="13.7841"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect1_innerShadow_1960_135682"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="22.8263" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_1960_135682"
                  />
                </filter>
              </defs>
            </svg> */}
          </div>
          <div className="balance-container">
            <div className="title">
              <Image src={userAvatar} alt="Actor 1" width={50} height={50} />
              Balance
            </div>

            <div className="amount">
              <span>
                {address ? (
                  <USDCBalance
                    walletAddress={address}
                    onBalanceUpdate={(balance) => {}}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </span>
            </div>

            <div className="cta">
              <button className="fund-wallet" onClick={openModal}>
                Fund Wallet
              </button>
              {/* <Transaction
                chainId={84532}
                contracts={contracts as ContractFunctionParameters[]}
                onStatus={handleOnStatus}
                onSuccess={() => {
                  console.log('success');
                }}
                onError={(err) => {
                  console.log(err);
                }}
              >
                <TransactionButton text="withdraw" className="tx-btton" />
                <TransactionSponsor />
                <TransactionStatus>
                  <TransactionStatusLabel className="status-label" />
                  <TransactionStatusAction className="status-label" />
                </TransactionStatus>
              </Transaction> */}

              <button className="withdraw" onClick={openWithdrawalModal}>
                <div>
                  <span>Make</span> Withdrawal
                </div>
                <svg
                  width="344"
                  height="232"
                  viewBox="0 0 344 232"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g filter="url(#filter0_dddddd_102_215964)">
                    <mask id="path-1-inside-1_102_215964" fill="white">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M152.076 3.97336C149.237 2.37253 146.448 0 143.189 0H103.767C101.974 0 100.234 0.602002 98.8243 1.70945L83.0574 14.0977C81.1271 15.6144 80 17.9334 80 20.3883V44C80 48.4183 83.5817 52 88 52H256C260.418 52 264 48.4183 264 44V8C264 3.58172 260.418 0 256 0H240.811C237.552 0 234.763 2.37252 231.924 3.97335C230.764 4.62703 229.426 5 228 5H156C154.574 5 153.236 4.62704 152.076 3.97336Z"
                      />
                    </mask>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M152.076 3.97336C149.237 2.37253 146.448 0 143.189 0H103.767C101.974 0 100.234 0.602002 98.8243 1.70945L83.0574 14.0977C81.1271 15.6144 80 17.9334 80 20.3883V44C80 48.4183 83.5817 52 88 52H256C260.418 52 264 48.4183 264 44V8C264 3.58172 260.418 0 256 0H240.811C237.552 0 234.763 2.37252 231.924 3.97335C230.764 4.62703 229.426 5 228 5H156C154.574 5 153.236 4.62704 152.076 3.97336Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M152.076 3.97336C149.237 2.37253 146.448 0 143.189 0H103.767C101.974 0 100.234 0.602002 98.8243 1.70945L83.0574 14.0977C81.1271 15.6144 80 17.9334 80 20.3883V44C80 48.4183 83.5817 52 88 52H256C260.418 52 264 48.4183 264 44V8C264 3.58172 260.418 0 256 0H240.811C237.552 0 234.763 2.37252 231.924 3.97335C230.764 4.62703 229.426 5 228 5H156C154.574 5 153.236 4.62704 152.076 3.97336Z"
                      fill="url(#pattern0_102_215964)"
                      fill-opacity="0.1"
                    />
                    <path
                      d="M231.924 3.97335L231.432 3.10228L231.924 3.97335ZM152.076 3.97336L152.568 3.10229L152.076 3.97336ZM103.767 1H143.189V-1H103.767V1ZM83.6752 14.8841L99.4422 2.49577L98.2065 0.923136L82.4396 13.3114L83.6752 14.8841ZM81 44V20.3883H79V44H81ZM256 51H88V53H256V51ZM263 8V44H265V8H263ZM240.811 1H256V-1H240.811V1ZM231.432 3.10228C230.419 3.67365 229.249 4 228 4V6C229.602 6 231.11 5.58042 232.415 4.84441L231.432 3.10228ZM228 4H156V6H228V4ZM156 4C154.751 4 153.581 3.67365 152.568 3.10229L151.585 4.84442C152.89 5.58042 154.398 6 156 6V4ZM240.811 -1C238.937 -1 237.251 -0.317642 235.732 0.507747C234.971 0.92145 234.229 1.384 233.519 1.83065C232.8 2.28286 232.117 2.71651 231.432 3.10228L232.415 4.84441C233.15 4.42977 233.88 3.96654 234.584 3.52367C235.297 3.07524 235.989 2.64451 236.687 2.26498C238.087 1.5039 239.425 1 240.811 1V-1ZM265 8C265 3.02944 260.971 -1 256 -1V1C259.866 1 263 4.13401 263 8H265ZM256 53C260.971 53 265 48.9706 265 44H263C263 47.866 259.866 51 256 51V53ZM79 44C79 48.9706 83.0294 53 88 53V51C84.134 51 81 47.866 81 44H79ZM82.4396 13.3114C80.268 15.0177 79 17.6265 79 20.3883H81C81 18.2403 81.9862 16.2112 83.6752 14.8841L82.4396 13.3114ZM143.189 1C144.575 1 145.913 1.5039 147.313 2.26499C148.011 2.64452 148.703 3.07525 149.416 3.52368C150.12 3.96655 150.85 4.42978 151.585 4.84442L152.568 3.10229C151.883 2.71652 151.2 2.28287 150.481 1.83066C149.771 1.38401 149.029 0.921457 148.268 0.507753C146.749 -0.317638 145.063 -1 143.189 -1V1ZM103.767 -1C101.75 -1 99.7922 -0.322747 98.2065 0.923136L99.4422 2.49577C100.675 1.52675 102.198 1 103.767 1V-1Z"
                      fill="#C1272D"
                      mask="url(#path-1-inside-1_102_215964)"
                    />
                  </g>
                  <path
                    d="M154 0H230V0C230 1.65685 228.657 3 227 3H157C155.343 3 154 1.65685 154 0V0Z"
                    fill="#C1272D"
                  />
                  <defs>
                    <filter
                      id="filter0_dddddd_102_215964"
                      x="0"
                      y="0"
                      width="344"
                      height="232"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="2.76726" />
                      <feGaussianBlur stdDeviation="1.1069" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_102_215964"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="6.6501" />
                      <feGaussianBlur stdDeviation="2.66004" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.186902 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_102_215964"
                        result="effect2_dropShadow_102_215964"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="12.5216" />
                      <feGaussianBlur stdDeviation="5.00862" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.154988 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect2_dropShadow_102_215964"
                        result="effect3_dropShadow_102_215964"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="22.3363" />
                      <feGaussianBlur stdDeviation="8.93452" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.13 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect3_dropShadow_102_215964"
                        result="effect4_dropShadow_102_215964"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="41.7776" />
                      <feGaussianBlur stdDeviation="16.711" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.105012 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect4_dropShadow_102_215964"
                        result="effect5_dropShadow_102_215964"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="100" />
                      <feGaussianBlur stdDeviation="40" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0730979 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect5_dropShadow_102_215964"
                        result="effect6_dropShadow_102_215964"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect6_dropShadow_102_215964"
                        result="shape"
                      />
                    </filter>
                    <pattern
                      id="pattern0_102_215964"
                      patternContentUnits="objectBoundingBox"
                      width="0.0244565"
                      height="0.0865385"
                    >
                      <use
                        xlinkHref="#image0_102_215964"
                        transform="scale(0.00271739 0.00961538)"
                      />
                    </pattern>
                    <image
                      id="image0_102_215964"
                      width="9"
                      height="9"
                      xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAiSURBVHgB3dCxAQAACMKw8v/P4gfKTOdMFXcmAK4Hgv/FLGnkEPHOzzMnAAAAAElFTkSuQmCC"
                    />
                  </defs>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="wallet-container">
          <div className="title">
            <h4>Wallet History</h4>
          </div>

          <WalletHistory />
        </div>
      </div>

      {isModalOpen && <FundWalletModal closeModal={closeModal} />}
      {isWithdrawalModalOpen && (
        <WithdrawalModal closeWithdrawalModal={closeWithdrawalModal} />
      )}
    </div>
  );
};

export default Walllet;
