import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
  children,
  animation = 'pop-up', // 'pop-up', 'slide-up', 'scale-in', 'slide-left', 'slide-right'
  delay = 0,
  threshold = 0.15,
  className = ''
}) {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Re-triggers every time user scrolls up or down into viewport
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Reset when leaving so it animates again when scrolling back
            setIsVisible(false);
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [threshold]);

  const getAnimationStyles = () => {
    const baseTransition = `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 0.65s ease ${delay}ms`;

    if (animation === 'pop-up') {
      return {
        transition: baseTransition,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.92)',
        filter: isVisible ? 'blur(0px)' : 'blur(4px)'
      };
    }

    if (animation === 'scale-in') {
      return {
        transition: baseTransition,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.88)',
        filter: isVisible ? 'blur(0px)' : 'blur(3px)'
      };
    }

    if (animation === 'slide-left') {
      return {
        transition: baseTransition,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-50px)'
      };
    }

    if (animation === 'slide-right') {
      return {
        transition: baseTransition,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(50px)'
      };
    }

    // Default slide-up
    return {
      transition: baseTransition,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(45px)'
    };
  };

  return (
    <div ref={domRef} className={`scroll-reveal-item ${className}`} style={getAnimationStyles()}>
      {children}
    </div>
  );
}
