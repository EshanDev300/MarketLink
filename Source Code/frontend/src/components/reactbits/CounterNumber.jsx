import React, { useEffect, useState } from 'react';

export default function CounterNumber({ end = 100, duration = 1200, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const finalVal = parseInt(end, 10) || 0;
    if (finalVal === 0) {
      setCount(0);
      return;
    }

    const stepTime = Math.abs(Math.floor(duration / finalVal));
    const timer = setInterval(() => {
      start += Math.ceil(finalVal / 30);
      if (start >= finalVal) {
        setCount(finalVal);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, Math.max(stepTime, 25));

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
