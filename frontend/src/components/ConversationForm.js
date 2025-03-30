import { useState, useEffect } from "react"
import { useConversationsContext } from "../hooks/useConversationsContext"
import { useAuthContext } from '../hooks/useAuthContext'
import { useLocation } from "react-router-dom";

const ConversationForm = () => {
  const { dispatch } = useConversationsContext()
  const { user } = useAuthContext()

  const location = useLocation()
  //const receiverId = location.state?.receiverId

  const [receiver_id, setReceiverId] = useState(location.state?.receiverId || '');
  const [content, setContent] = useState('')
  const [creator_id, setCreatorId] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  /*useEffect(() => {
    if (receiverId) {
      setReceiverId(receiverId);
    }
  }, [receiverId]);*/

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const conversation = {
      receiver_id,
      messages: [{
        receiver_id,
        content,
        creator_id: user._id
      }]
    };

    const response = await fetch('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setContent('')
      setError(null)
      setEmptyFields([])
      dispatch({ type: 'CREATE_CONVERSATION', payload: json })
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Message</h3>

      <label>Receiver id:</label>
      <input
        type="text"
        onChange={(e) => setReceiverId(e.target.value)}
        value={receiver_id}
      //className={emptyFields.includes('receiver_id') ? 'error' : ''}
      />

      <label>Content:</label>
      <input
        type="text"
        onChange={(e) => setContent(e.target.value)}
        value={content}
      //className={emptyFields.includes('content') ? 'error' : ''}
      />

      <button>Add Message</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default ConversationForm