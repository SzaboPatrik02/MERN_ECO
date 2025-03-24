import { useState, useEffect } from 'react'
import { useChallengesContext } from '../hooks/useChallengesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import moment from 'moment'

const ChallengeDetails = ({ challenge }) => {
  const { dispatch } = useChallengesContext()
  const { user } = useAuthContext()

  const [editedChallenge, setEditedChallenge] = useState(null);

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(challenge.name)
  const [description, setDescription] = useState(challenge.description)
  const [valid_until, setValid_until] = useState(challenge.valid_until)
  const [group_members, setGroup_members] = useState(challenge.group_members)
  const [creator_id, setCreator_id] = useState(challenge.creator_id)

  const handleDelete = async () => {
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

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!user) return

    const updatedChallenge = { name, description, valid_until, group_members, creator_id }

    const response = await fetch(`/api/challenges/${challenge._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedChallenge),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {

      setIsEditing(false)

      dispatch({ type: 'UPDATE_CHALLENGE', payload: json })

    }
  }

  useEffect(() => {
    if (editedChallenge) {
      setName(editedChallenge.name);
      setDescription(editedChallenge.description);
      setValid_until(editedChallenge.valid_until);
      setGroup_members(editedChallenge.group_members);
    }
  }, [editedChallenge])

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <h3>Edit Challenge</h3>
          <label>name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <label>Valid until:</label>
          <input type="text" value={valid_until} onChange={(e) => setValid_until(e.target.value)} required />
          <label>Group members:</label>
          <input type="text" value={group_members} onChange={(e) => setGroup_members(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        < div >
          <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
          <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
          <h4>{challenge.name}</h4>
          <p><strong>Description: </strong>{challenge.description}</p>
          <p><strong>Valid until: </strong>{moment(challenge.valid_until).format('YYYY-MM-DD HH:mm')}</p>
          <p><strong>Ratings: </strong>{challenge.ratings}</p>

          <p><strong>Group Members:</strong></p>
          {challenge.group_members.map((member, index) => (
            <p key={index}>{member.user_id}</p>
          ))}
          <p>{formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}</p>
        </div >
      )}
    </div>
  )
}

export default ChallengeDetails