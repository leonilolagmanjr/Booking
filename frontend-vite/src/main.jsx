import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { FriendProvider } from './context/FriendContext';
import { NotificationProvider } from './context/NotificationContext';
import { CourtFlowProvider } from './context/CourtFlowContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FriendProvider>
        <NotificationProvider>
          <CourtFlowProvider>
            <App />
          </CourtFlowProvider>
        </NotificationProvider>
      </FriendProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
