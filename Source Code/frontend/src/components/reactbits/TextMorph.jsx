import React, { useState, useEffect } from 'react';

export default function TextMorph({
  words = [
    'Farm Fresh Produce',
    'Zero Middleman Markups',
    'Dawn Sunrise Harvests',
    'Direct Local Growers',
    'Pure Organic Goodness'
  ],
  interval = 3200,
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMorphing, setIsMorphing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsMorphing(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsMorphing(false);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`text-morph-container d-inline-block position-relative ${className}`}
      style={{
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease, filter 0.35s ease',
        transform: isMorphing ? 'translateY(-12px) scale(0.96)' : 'translateY(0) scale(1)',
        opacity: isMorphing ? 0.2 : 1,
        filter: isMorphing ? 'blur(6px)' : 'blur(0px)'
      }}
    >
      <span className="text-morph-content">{words[currentIndex]}</span>
    </span>
  );
}
