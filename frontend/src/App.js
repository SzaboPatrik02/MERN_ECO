import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home'
import Conversations from './pages/Conversations'
import Workouts from './pages/Workouts'
import Notifications from './pages/Notifications'
import Advices from './pages/Advices'
import Challenges from './pages/Challenges'
import Events from './pages/Events'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/conversations" 
              element={user ? <Conversations /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/workouts" 
              element={
                user && user.role === 'coach' ? (
                  <Workouts />
                ) : user ? (
                  <Navigate to="/" />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/notifications" 
              element={user ? <Notifications /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/sportevents" 
              element={user ? <Events /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/advices" 
              element={
                user && user.role === 'coach' ? (
                  <Advices />
                ) : user ? (
                  <Navigate to="/" />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/challenges" 
              element={user ? <Challenges /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;