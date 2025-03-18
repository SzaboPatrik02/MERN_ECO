import { useChallengesContext } from '../hooks/useChallengesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const ChallengeDetails = ({ challenge }) => {
  const { dispatch } = useChallengesContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/challenges/' + challenge._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_CHALLENGE', payload: json })
    }
  }

  return (
    <div className="workout-details">
      <h4>{challenge.name}</h4>
      <p><strong>Description: </strong>{challenge.description}</p>
      <p><strong>Valid_until: </strong>{challenge.valid_until}</p>
      <p><strong>Ratings: </strong>{challenge.ratings}</p>

      <p><strong>Group Members:</strong></p>
      {challenge.group_members.map((member, index) => (
        <p key={index}>{member.user_id}</p>
      ))}
      <p>{formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default ChallengeDetails