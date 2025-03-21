import { useState, useEffect } from 'react'
import { useAdvicesContext } from '../hooks/useAdvicesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const AdviceDetails = ({ advice }) => {
  const { dispatch } = useAdvicesContext()
  const { user } = useAuthContext()

  const [editedAdvice, setEditedAdvice] = useState(null);

  const [isEditing, setIsEditing] = useState(false)
  const [receiver_id, setReceiver_id] = useState(advice.receiver_id)
  const [type, setType] = useState(advice.type)
  const [content, setContent] = useState(advice.content)
  const [creator_id, setCreator_id] = useState(advice.creator_id)

  const handleDelete = async () => {
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
      dispatch({ type: 'DELETE_ADVICE', payload: json })
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!user) return

    const updatedAdvice = { receiver_id, type, content, creator_id }

    const response = await fetch(`/api/advices/${advice._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedAdvice),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {

      setIsEditing(false)

      dispatch({ type: 'UPDATE_ADVICE', payload: json })

    }
  }

  useEffect(() => {
    if (editedAdvice) {
      setReceiver_id(editedAdvice.receiver_id);
      setType(editedAdvice.type);
      setContent(editedAdvice.content);
    }
  }, [editedAdvice])

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <h3>Edit Advice</h3>
          <label>receiver_id:</label>
          <input type="text" value={receiver_id} onChange={(e) => setReceiver_id(e.target.value)} required />
          <label>type:</label>
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
          <label>Content:</label>
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
          <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
          <h4>{advice.receiver_id}</h4>
          <p><strong>Type: </strong>{advice.type}</p>
          <p><strong>Content: </strong>{advice.content}</p>
          <p><strong>Creator_id: </strong>{advice.creator_id}</p>
          <p>{formatDistanceToNow(new Date(advice.createdAt), { addSuffix: true })}</p>
        </div>
      )}
    </div>
  )
}



export default AdviceDetails