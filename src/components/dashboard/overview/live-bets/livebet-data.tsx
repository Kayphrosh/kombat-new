// /data/liveBetsData.ts
import youImage from '@/assets/images/icons/you.png';
import userImage from '@/assets/images/icons/ken.png'; // Opponent image

export const liveBets = [
  {
    id: 1,
    opponent: 'Kendrick',
    opponentImage: userImage, // Opponent's avatar
    youImage: youImage, // Your avatar
    timeLeft: '2d : 3h : 23m',
    stake: '$12,000',
    description:
      'The name of the ballon was found in the year 1892 The name of the ballon was found in the year 1892 The name of the ballon was found in the year 1892 The name of the ballon was found in the year 1892     ',
  },
  {
    id: 2,
    opponent: 'k,f,t,...',
    opponentImage: userImage,
    youImage: youImage,
    timeLeft: '2d : 3h : 23m',
    stake: '$12,000',
    description: 'Another bet description...',
  },
  {
    id: 3,
    opponent: 'Kendrick',
    opponentImage: userImage,
    youImage: youImage,
    timeLeft: '2d : 3h : 23m',
    stake: '$12,000',
    description: 'Another bet description...',
  },
];

export const getTotalLiveBets = () => `0${liveBets.length}`;