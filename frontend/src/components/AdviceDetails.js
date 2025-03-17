import { useAdvicesContext } from '../hooks/useAdvicesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const AdviceDetails = ({ advice }) => {
  const { dispatch } = useAdvicesContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/advices/' + advice._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_ADVICE', payload: json})
    }
  }

  return (
    <div className="workout-details">
      <h4>{advice.receiver_id}</h4>
      <p><strong>Type: </strong>{advice.type}</p>
      <p><strong>Content: </strong>{advice.content}</p>
      <p><strong>Creator: </strong>{advice.creator_id}</p>
      <p>{formatDistanceToNow(new Date(advice.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default AdviceDetails