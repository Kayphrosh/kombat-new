import { useState, useEffect } from 'react';

interface CountdownProps {
  endTime: number;
}

function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = calculateTimeLeft();
      setTimeLeft(timeRemaining);

      if (timeRemaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  function calculateTimeLeft() {
    const now = Math.floor(Date.now() / 1000); // Get current time in Unix format (seconds)
    const total = endTime - now; // Time difference in seconds

    const days = Math.floor(total / (60 * 60 * 24));
    const hours = Math.floor((total % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((total % (60 * 60)) / 60);
    const seconds = Math.floor(total % 60);

    return { total, days, hours, minutes, seconds };
  }

  return (
    <div>
      {timeLeft.total > 0 ? (
        <p className="time-left-value">
          {timeLeft.days}d:{timeLeft.hours}hr:{timeLeft.minutes}min:
          {timeLeft.seconds}sec
        </p>
      ) : (
        <p>Time up</p>
      )}
    </div>
  );
}

export default Countdown;
