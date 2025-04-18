import { useEffect }from 'react'
import { useNotificationsContext } from "../hooks/useNotificationContext"
import { useAuthContext } from "../hooks/useAuthContext"

import NotificationDetails from '../components/NotificationDetails'

const Notifications = () => {
  const {notifications, dispatch} = useNotificationsContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/user/notifications', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_NOTIFICATIONS', payload: json})
      }
    }

    if (user) {
        fetchNotifications()
    }
  }, [dispatch, user, notifications])

  return (
    <div className="page">
      <div>
        {notifications && notifications.map((notification) => (
          <NotificationDetails key={notification._id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

export default Notifications