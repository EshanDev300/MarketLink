import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Styling: Custom eGreen Basket Design System & Micro-Animations (Strictly No Tailwind CSS)
import './styles/custom.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
