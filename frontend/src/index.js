import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConversationsContextProvider } from './context/ConversationContext'
import { WorkoutsContextProvider } from './context/WorkoutContext'
import { AuthContextProvider } from './context/AuthContext'
import { AdvicesContextProvider } from './context/AdviceContext'
import { ChallengesContextProvider } from './context/ChallengeContext'
import { EventsContextProvider } from './context/EventContext'
import { NotificationsContextProvider } from './context/NotificationContext'
import { UsersContextProvider } from './context/UserContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UsersContextProvider>
        <WorkoutsContextProvider>
          <AdvicesContextProvider>
            <ChallengesContextProvider>
              <EventsContextProvider>
                <NotificationsContextProvider>
                  <ConversationsContextProvider>
                    <App />
                  </ConversationsContextProvider>
                </NotificationsContextProvider>
              </EventsContextProvider>
            </ChallengesContextProvider>
          </AdvicesContextProvider>
        </WorkoutsContextProvider>
      </UsersContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);