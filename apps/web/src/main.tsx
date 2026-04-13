import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: any;
        colorScheme: string;
        themeParams: any;
        MainButton: any;
        BackButton: any;
        HapticFeedback: any;
      };
    };
  }
}

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
