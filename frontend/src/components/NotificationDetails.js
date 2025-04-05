import { useNotificationsContext } from '../hooks/useNotificationContext'
import { useAuthContext } from '../hooks/useAuthContext'

import { useNavigate } from 'react-router-dom';
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const NotificationDetails = ({ notification }) => {
  const { dispatch } = useNotificationsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate();

  const handleMarkAsRead = async () => {
    if (!user) return

    const response = await fetch(`/api/user/notifications/${notification._id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      dispatch({ type: 'MARK_AS_READ', payload: notification._id })
    }
  }

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/user/notifications/' + notification._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: json })
    }
  }
  const handleRedirect = () => {
    if (notification.type === 'workout') {
      navigate('/advices', {
        state: {
          receiverId: notification.sender_id,
          isRedirect: true
        }
      })
    } else if (notification.type === 'advice') {
      navigate('/conversations', {
        state: {
          receiverId: notification.sender_id,
          isRedirect: true
        }
      })
    }
    if (!notification.read) {
      handleMarkAsRead()
    }
  };

  return (
    <div className="workout-details">
      {!notification.read && (
        <button onClick={handleMarkAsRead} className="mark-as-read-btn">
          Mark as Read
        </button>
      )}
      <span className="material-symbols-outlined noti" onClick={handleClick}>delete</span>
      {(notification.type === 'workout' || notification.type === 'advice') && (
        <span className="material-symbols-outlined noti" onClick={handleRedirect}>reply</span>
      )}
      <h4>Sender_id: {notification.sender_id}</h4>
      <p><strong>content: </strong>{notification.content}</p>
      <p><strong>related_id: </strong>{notification.related_id}</p>
      <p><strong>read: </strong>{notification.read ? 'Yes' : 'No'}</p>
      <p><strong>received_at: </strong>{notification.received_at}</p>
      <p>received_at:{formatDistanceToNow(new Date(notification.received_at), { addSuffix: true })}</p>
      {!notification.read && <span className="unread-badge">NEW</span>}
    </div>
  )
}

export default NotificationDetails