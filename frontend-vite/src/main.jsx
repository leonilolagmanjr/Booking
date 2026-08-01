import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/globals.css';
import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext';
import { CourtFlowProvider } from './context/CourtFlowContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <NotificationProvider>
        <CourtFlowProvider>
          <App />
        </CourtFlowProvider>
      </NotificationProvider>
    </Router>
  </React.StrictMode>
);
