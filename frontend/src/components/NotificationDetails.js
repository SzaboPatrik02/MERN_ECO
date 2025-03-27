import { useNotificationsContext } from '../hooks/useNotificationContext'
import { useAuthContext } from '../hooks/useAuthContext'

import { useNavigate } from 'react-router-dom';
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const NotificationDetails = ({ notification }) => {
  const { dispatch } = useNotificationsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate();
  

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
    navigate('/advices', { state: { receiverId: notification.sender_id } });
  };

  return (
    <div className="workout-details">
      <span className="material-symbols-outlined noti" onClick={handleClick}>delete</span>
      <span className="material-symbols-outlined noti" onClick={handleRedirect}>reply</span>
      <h4>Sender_id: {notification.sender_id}</h4>
      <p><strong>content: </strong>{notification.content}</p>
      <p><strong>related_id: </strong>{notification.related_id}</p>
      <p><strong>read: </strong>{notification.read ? 'Yes' : 'No'}</p>
      <p><strong>received_at: </strong>{notification.received_at}</p>
      <p>received_at:{formatDistanceToNow(new Date(notification.received_at), { addSuffix: true })}</p>
    </div>
  )
}

export default NotificationDetails