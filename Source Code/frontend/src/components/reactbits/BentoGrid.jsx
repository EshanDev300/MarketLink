import React from 'react';

export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`bento-grid ${className}`}>
      {children}
    </div>
  );
}

export function BentoItem({ children, col = 4, className = '', style = {} }) {
  const colClass = `bento-col-${col}`;
  return (
    <div className={`bento-item ${colClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
