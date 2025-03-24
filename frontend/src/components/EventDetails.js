import { useState, useEffect } from 'react'
import { useEventsContext } from '../hooks/useEventsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import moment from 'moment'

const EventDetails = ({ event, isMainPage }) => {
  const { dispatch } = useEventsContext()
  const { user } = useAuthContext()

  const [groupMembers, setGroupMembers] = useState(event.group_members);

  const [editedEvent, setEditedEvent] = useState(null);

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(event.name)
  const [description, setDescription] = useState(event.description)
  const [event_date, setEvent_date] = useState(event.event_date)
  const [group_members, setGroup_members] = useState(event.group_members)
  const [creator_id, setCreator_id] = useState(event.creator_id)

  const handleJoin = async () => {
    if (!user) return;
  
    // Ha a felhasználó már tag, ne adja hozzá újra
    if (group_members.some(member => member.user_id === user.user_id)) {
      alert("Már feliratkoztál erre a kihívásra!");
      return;
    }

    const updatedGroupMembers = [...group_members];
  
    // Új belépő objektuma
    const newMember = {
      user_id: user.user_id, // A bejelentkezett felhasználó azonosítója
      joined_at: new Date().toISOString() // Az aktuális dátum és idő
    };
    console.log("newMember:", newMember);

    updatedGroupMembers.push(newMember);
  
    const response = await fetch(`/api/sportevents/${event._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ group_members: updatedGroupMembers }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    });
  
    const json = await response.json();
    console.log("Szerver válasza:", json);
  
    if (response.ok) {
      console.log("User objektum:", user);
      setGroup_members(updatedGroupMembers); // Frissítjük a state-et
      dispatch({ type: 'UPDATE_SPORTEVENT', payload: json }); // Context frissítése
    } else {
      alert(json.error);
    }
  };

  const handleDelete = async () => {
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

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!user) return

    const updatedEvent = { name, description, event_date, group_members, creator_id }

    const response = await fetch(`/api/sportevents/${event._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedEvent),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {

      setIsEditing(false)

      dispatch({ type: 'UPDATE_SPORTEVENT', payload: json })

    }
  }

  useEffect(() => {
    if (editedEvent) {
      setName(editedEvent.name);
      setDescription(editedEvent.description);
      setEvent_date(editedEvent.event_date);
      setGroup_members(editedEvent.group_members);
    }
  }, [editedEvent])

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <h3>Edit Event</h3>
          <label>name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <label>Event date:</label>
          <input type="text" value={event_date} onChange={(e) => setEvent_date(e.target.value)} required />
          <label>Group members:</label>
          <input type="text" value={group_members} onChange={(e) => setGroup_members(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        < div >
          {!isMainPage ? (
            <div>
              <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
              <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
            </div>
          ) : (
            <span className="add material-symbols-outlined" onClick={handleJoin}>add</span>
          )}
          <h4>{event.name}</h4>
          <p><strong>Description: </strong>{event.description}</p>
          <p><strong>Event date: </strong>{moment(event.event_date).format('YYYY-MM-DD HH:mm')}</p>

          <p><strong>Group Members:</strong></p>
          {
            event.group_members.map((member, index) => (
              <p key={index}>{member.user_id}</p>
            ))
          }
          <p>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</p>
        </div >
      )}
    </div >
  )
}

export default EventDetails