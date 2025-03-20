import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutsContextProvider } from './context/WorkoutContext'
import { AuthContextProvider } from './context/AuthContext'
import { AdvicesContextProvider } from './context/AdviceContext'
import { ChallengesContextProvider } from './context/ChallengeContext'
import { EventsContextProvider } from './context/EventContext'
import { NotificationsContextProvider } from './context/NotificationContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <AdvicesContextProvider>
          <ChallengesContextProvider>
            <EventsContextProvider>
              <NotificationsContextProvider>
                <App />
              </NotificationsContextProvider>
            </EventsContextProvider>
          </ChallengesContextProvider>
        </AdvicesContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);