import { useState, useEffect } from "react"
import { useAdvicesContext } from "../hooks/useAdvicesContext"
import { useAuthContext } from '../hooks/useAuthContext'
import { useLocation } from "react-router-dom";

const AdviceForm = ({ isRedirect: propIsRedirect }) => {
  const { dispatch } = useAdvicesContext()
  const { user } = useAuthContext()

  const location = useLocation()
  const isRedirect = propIsRedirect || location.state?.isRedirect
  const receiverId = location.state?.receiverId

  const [receiver_id, setReceiverId] = useState('')
  const [type, setType] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    if (receiverId) {
      setReceiverId(receiverId);
    }
  }, [receiverId]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const advice = { receiver_id, type, content }

    const response = await fetch('/api/advices', {
      method: 'POST',
      body: JSON.stringify(advice),
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
      setReceiverId('')
      setType('')
      setContent('')
      setError(null)
      setEmptyFields([])
      dispatch({ type: 'CREATE_ADVICE', payload: json })
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Advice</h3>

      {!isRedirect && (
        <div>
          <label>Receiver id:</label>
          <input
            type="text"
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiver_id}
            className={emptyFields.includes('receiver_id') ? 'error' : ''}
          />
        </div>
      )}


      <label>Content:</label>
      <input
        type="text"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className={emptyFields.includes('content') ? 'error' : ''}
      />

      <button>Add Advice</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default AdviceForm