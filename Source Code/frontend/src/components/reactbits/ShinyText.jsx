import React from 'react';

export default function ShinyText({ text, className = '' }) {
  return (
    <span className={`shiny-text ${className}`}>
      {text}
    </span>
  );
}
