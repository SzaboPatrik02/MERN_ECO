import { useEventsContext } from '../hooks/useEventsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const EventDetails = ({ event }) => {
  const { dispatch } = useEventsContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/sportevents/' + event._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_SPORTEVENT', payload: json })
    }
  }

  return (
    <div className="workout-details">
      <h4>{event.name}</h4>
      <p><strong>Description: </strong>{event.description}</p>
      <p><strong>Event date: </strong>{event.event_date}</p>

      <p><strong>Group Members:</strong></p>
      {event.group_members.map((member, index) => (
        <p key={index}>{member.user_id}</p>
      ))}
      <p>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default EventDetails