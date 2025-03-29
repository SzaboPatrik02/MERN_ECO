import { useState, useEffect } from 'react'
import { useEventsContext } from '../hooks/useEventsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import moment from 'moment'

const EventDetails = ({ event, isMainPage }) => {
  const { dispatch } = useEventsContext()
  const { user } = useAuthContext()

  const [editedEvent, setEditedEvent] = useState(null);

  const [isEditingQuess, setIsEditingQuess] = useState(false);

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(event.name)
  const [description, setDescription] = useState(event.description)
  const [event_date, setEvent_date] = useState(event.event_date)
  const [group_members, setGroup_members] = useState(event.group_members)
  const [result, setResult] = useState(event.result)
  const [creator_id, setCreator_id] = useState(event.creator_id)
  const [users, setUsers] = useState([]);

  const [userGuess, setUserGuess] = useState(
    group_members.find(m => m.user_id === user.user_id)?.guess || ""
  );

  useEffect(() => {
    setGroup_members(event.group_members);
  }, [event.group_members]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log("Felhasználók betöltve:", data);

        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Hiba a felhasználók lekérdezésekor:", data.error);
        }
      } catch (error) {
        console.error('Hálózati hiba:', error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleGuessChange = (e) => {
    setIsEditing(true);
    setIsEditingQuess(true);
  };

  const handleJoin = async () => {
    if (!user) return;

    if (group_members.some(member => member.user_id === user.user_id)) {
      alert("Már feliratkoztál erre az eseményre!");
      return;
    }

    const newMember = {
      user_id: user.user_id,
      joined_at: new Date().toISOString()
    };

    const updatedGroupMembers = [...group_members, newMember];

    try {
      const response = await fetch(`/api/sportevents/${event._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ group_members: updatedGroupMembers }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        setGroup_members(updatedGroupMembers);

        dispatch({ type: 'UPDATE_SPORTEVENT', payload: json });

        event.group_members = updatedGroupMembers;
      } else {
        alert(json.error);
      }
    } catch (error) {
      console.error("Hiba történt a csatlakozás során:", error);
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

    const updatedMembers = group_members.map(member => {
      if (member.user_id === user.user_id) {
        return { ...member, guess: userGuess };
      }
      return member;
    });

    setIsEditing(true);
    setIsEditingQuess(false);

    const updatedEvent = { name, description, event_date, group_members: updatedMembers, result, creator_id }

    console.log("Frissített adatok küldés előtt:", updatedEvent);

    try {
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
        setGroup_members(updatedMembers);
        dispatch({ type: 'UPDATE_SPORTEVENT', payload: json })

      }
    } catch (error) {
      console.error("Hiba történt a módosítás során:", error);
    }
  }

  useEffect(() => {
    if (editedEvent) {
      setName(editedEvent.name);
      setDescription(editedEvent.description);
      setEvent_date(editedEvent.event_date);
      setGroup_members(editedEvent.group_members);
      setResult(editedEvent.result);
    }
  }, [editedEvent])

  const isWinner = (result, guess) => {
    return result && guess === result;
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <h3>Edit Event</h3>

          {isEditingQuess ? (
            <div>
              <label>Guess:</label>
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="X - Y"
                required
              />
            </div>
          ) : (
            <div>
              <label>name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <label>description:</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <label>Event date:</label>
              <input type="text" value={event_date} onChange={(e) => setEvent_date(e.target.value)} required />
              <label>Group members:</label>
              <input type="text" value={group_members} onChange={(e) => setGroup_members(e.target.value)} required />
              <label>Guess:</label>
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="X - Y"
                required
              />
              <label>Result:</label>
              <input type="text" value={result} onChange={(e) => setResult(e.target.value)} placeholder="X - Y" />
            </div>
          )}

          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setIsEditingQuess(false);
            }}
          >
          Cancel </button>
        </form>
      ) : (
        < div >
          {!isMainPage ? (
            <div>
              <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
              <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
              <span className="edit material-symbols-outlined" onClick={handleGuessChange}>add</span>
            </div>
          ) : (
            <span className="add material-symbols-outlined" onClick={handleJoin}>add</span>
          )}
          <h4>{event.name}</h4>
          <p><strong>Description: </strong>{event.description}</p>
          <p><strong>Event date: </strong>{moment(event.event_date).format('YYYY-MM-DD HH:mm')}</p>

          <p><strong>Group Members:</strong></p>
          <ul>
            {event.group_members.map((member, index) => {
              const userInfo = users.find(u => u._id === member.user_id);
              return (
                <li key={index}>
                  {userInfo ? userInfo.username : "Ismeretlen felhasználó"}
                  <p>{member.guess}</p>
                  {isWinner(event.result, member.guess) && <p>WINNER!</p>}
                </li>);
            })}
          </ul>
          <p><strong>Result: </strong>{event.result}</p>
          <p>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</p>
        </div >
      )}
    </div >
  )
}

export default EventDetails