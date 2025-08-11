import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have a CSS file for base styles (like Tailwind)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);