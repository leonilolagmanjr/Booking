import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { FriendProvider } from './context/FriendContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FriendProvider>
        <App />
      </FriendProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
