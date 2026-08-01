import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/globals.css';
import App from './App.jsx';
import { CourtFlowProvider } from './context/CourtFlowContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <CourtFlowProvider>
        <App />
      </CourtFlowProvider>
    </Router>
  </React.StrictMode>
);
