import { useState } from "react"
import { useEventsContext } from "../hooks/useEventsContext"
import { useAuthContext } from '../hooks/useAuthContext'

const EventForm = () => {
  const { dispatch } = useEventsContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [event_date, setEventDate] = useState('')
  const [group_members, setGroupMembers] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const event = {name, description, event_date, group_members: Array.isArray(group_members) ? group_members : [] }

    const response = await fetch('/api/sportevents', {
      method: 'POST',
      body: JSON.stringify(event),
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
      setEventDate('')
      setGroupMembers('')
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_SPORTEVENT', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Event</h3>

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

      <label>Event date:</label>
      <input 
        type="datetime-local"
        onChange={(e) => setEventDate(e.target.value)}
        value={event_date}
        className={emptyFields.includes('event_date') ? 'error' : ''}
      />

      <button>Add Event</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default EventForm