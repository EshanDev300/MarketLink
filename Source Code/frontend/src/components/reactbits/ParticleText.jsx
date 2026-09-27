import React, { useRef, useEffect } from 'react';

/**
 * ParticleText Component (ReactBits style)
 * URL: https://reactbits.dev/text-animations/particle-text
 * Converts text into interactive canvas particles that scatter on hover and return to form letters.
 */
export default function ParticleText({
  text = 'FARM FRESH',
  color = '#10b981',
  fontSize = 46,
  particleRadius = 2,
  className = '',
  height = 90
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 45 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];

    const init = () => {
      // Set canvas dimensions
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
      canvas.width = Math.min(width, 800);
      canvas.height = height;

      // Draw text to an offscreen canvas or temporary canvas to read pixels
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Extract pixel data
      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = [];
      const density = 4; // Sample every 4th pixel for performance & crisp aesthetics

      for (let y = 0; y < textCoordinates.height; y += density) {
        for (let x = 0; x < textCoordinates.width; x += density) {
          const index = (y * 4 * textCoordinates.width) + (x * 4);
          const alpha = textCoordinates.data[index + 3];

          if (alpha > 128) {
            particles.push({
              x: Math.random() * canvas.width, // Spawn scattered
              y: Math.random() * canvas.height,
              originX: x,
              originY: y,
              color: color,
              size: particleRadius,
              vx: 0,
              vy: 0,
              friction: 0.88,
              springFactor: 0.08
            });
          }
        }
      }
    };

    init();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleResize = () => {
      init();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mRadius = mouseRef.current.radius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Repel from mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mRadius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 12;
          const directionY = forceDirectionY * force * 12;

          p.vx -= directionX;
          p.vy -= directionY;
        }

        // Spring back to origin
        const springDx = p.originX - p.x;
        const springDy = p.originY - p.y;

        p.vx += springDx * p.springFactor;
        p.vy += springDy * p.springFactor;

        p.vx *= p.friction;
        p.vy *= p.friction;

        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [text, color, fontSize, particleRadius, height]);

  return (
    <div className={`particle-text-wrapper text-center overflow-hidden ${className}`}>
      <canvas ref={canvasRef} style={{ display: 'inline-block', maxWidth: '100%' }} />
    </div>
  );
}
