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
    <div className="details">
      {!notification.read && (
        <button onClick={handleMarkAsRead} className="mark-as-read-btn">
          Mark as Read
        </button>
      )}
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
      {(notification.type === 'workout' || notification.type === 'advice') && (
        <span className="reply material-symbols-outlined" onClick={handleRedirect}>reply</span>
      )}
      <h4>{notification.content}</h4>
      {notification.type === 'advice' && (
        <p className='type type-advice'>type: {notification.type}</p>
      )}
      {notification.type === 'workout' && (
        <p className='type type-workout'>type: {notification.type}</p>
      )}

      <p><strong>read: </strong>{notification.read ? 'Yes' : 'No'}</p>

      {!notification.read && <span className="unread-badge">NEW</span>}
      <p><strong>received: </strong>{formatDistanceToNow(new Date(notification.received_at), { addSuffix: true })}</p>

    </div>
  )
}

export default NotificationDetails