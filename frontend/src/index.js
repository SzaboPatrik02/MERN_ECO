import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutsContextProvider } from './context/WorkoutContext'
import { AuthContextProvider } from './context/AuthContext'
import { AdvicesContextProvider } from './context/AdviceContext'
import { ChallengesContextProvider } from './context/ChallengeContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <AdvicesContextProvider>
          <ChallengesContextProvider>
            <App />
          </ChallengesContextProvider>
        </AdvicesContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);