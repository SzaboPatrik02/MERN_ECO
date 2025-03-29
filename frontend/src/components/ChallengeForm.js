import { useState } from "react"
import { useChallengesContext } from "../hooks/useChallengesContext"
import { useAuthContext } from '../hooks/useAuthContext'

const ChallengeForm = () => {
  const { dispatch } = useChallengesContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [valid_until, setValidUntil] = useState('')
  const [to_achive, setTo_achive] = useState('')
  const [group_members, setGroupMembers] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const challenge = {name, description, valid_until, to_achive, group_members: Array.isArray(group_members) ? group_members : [] }

    const response = await fetch('/api/challenges', {
      method: 'POST',
      body: JSON.stringify(challenge),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      console.log("Server response:", json);
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setName('')
      setDescription('')
      setValidUntil('')
      setTo_achive('')
      setGroupMembers('')
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_CHALLENGE', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Challenge</h3>

      <label>Name:</label>
      <input 
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes('name') ? 'error' : ''}
      />

      <label>Description:</label>
      <input 
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}
      />

      <label>Valid_until:</label>
      <input 
        type="datetime-local"
        onChange={(e) => setValidUntil(e.target.value)}
        value={valid_until}
        className={emptyFields.includes('valid_until') ? 'error' : ''}
      />

      <label>To achive:</label>
      <input 
        type="number"
        onChange={(e) => setTo_achive(e.target.value)}
        value={to_achive}
        className={emptyFields.includes('to_achive') ? 'error' : ''}
      />

      <button>Add Challenge</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default ChallengeForm