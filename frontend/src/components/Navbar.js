import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNotificationsContext } from '../hooks/useNotificationContext'

import { FaComments, FaBell, FaDumbbell, FaCalendarAlt, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { useEffect, useState } from 'react'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const [unreadNotiCount, setUnreadNotiCount] = useState(0)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  useEffect(() => {
    const fetchUnreadNotiCount = async () => {
      if (user) {
        const response = await fetch('/api/user/notifications/unread', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        const data = await response.json()
        setUnreadNotiCount(data.count)
      }
    }

    fetchUnreadNotiCount()
    const interval = setInterval(fetchUnreadNotiCount, 2000)

    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      if (user) {
          const response = await fetch('/api/conversations/unread', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          const data = await response.json();
          setUnreadMessagesCount(data.count);
      }
    };
  
    fetchUnreadMessagesCount();
    const interval = setInterval(fetchUnreadMessagesCount, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Eco Environment</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <Link to="/workouts">Workouts</Link>
              <Link to="/sportevents">Events</Link>
              <Link to="/challenges">Challenges</Link>
              <Link to="/advices">Advices</Link>
              <Link to="/conversations" className="nav-notification">
                <FaComments className="nav-icon large-icon" />
                {unreadMessagesCount > 0 && (
                  <span className="notification-badge">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </Link>
              <Link to="/notifications" className="nav-notification">
                <FaBell className="nav-icon large-icon" />
                {unreadNotiCount > 0 && (
                  <span className="notification-badge">
                    {unreadNotiCount > 9 ? '9+' : unreadNotiCount}
                  </span>
                )}
              </Link>
              <span>
                {user.username}
                {user.role === 'coach' && ' 👨‍🏫'}
                {user.role === 'admin' && ' ⚙️'}
                {user.role === 'user' && ' '}
                {user.role}
              </span>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar