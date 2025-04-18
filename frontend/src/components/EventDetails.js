import { useState, useEffect } from 'react'
import { useEventsContext } from '../hooks/useEventsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom';
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import moment from 'moment'

const EventDetails = ({ event, isMainPage }) => {
  const { dispatch } = useEventsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

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

  const handleMemberClick = (memberId) => {
    navigate(`/user/${memberId}`);
  }
  /*const handleMemberClick = (memberId) => {
    navigate('/conversations', {
      state: {
        receiverId: memberId,
        presetMessage: `Szia! Az "${event.name}" eseményről szeretnék beszélni.`
      }
    });
  };*/

  const handleTakeAway = async () => {
    if (!user) return;

    try {
      const updatedGroupMembers = group_members.filter(
        member => member.user_id !== user.user_id
      );

      const response = await fetch(`/api/sportevents/${event._id}/list`, {
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
      console.error("Error removing user from event:", error);
    }
  };

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
      const response = await fetch(`/api/sportevents/${event._id}/list`, {
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

    try {
      let response;

      if (isEditingQuess) {
        // Csak a guess-t frissítjük - mindenki megteheti
        response = await fetch(`/api/sportevents/${event._id}/guess`, {
          method: 'PATCH',
          body: JSON.stringify({ guess: userGuess }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        })
      } else {
        // Teljes esemény frissítése - csak admin
        const updatedMembers = group_members.map(member => {
          if (member.user_id === user.user_id) {
            return { ...member, guess: userGuess };
          }
          return member;
        });

        const updatedEvent = { name, description, event_date, group_members: updatedMembers, result, creator_id }

        response = await fetch(`/api/sportevents/${event._id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedEvent),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        })
      }

      const json = await response.json()

      if (response.ok) {
        setIsEditing(false)
        setIsEditingQuess(false)
        dispatch({ type: 'UPDATE_SPORTEVENT', payload: json })
      } else {
        throw new Error(json.error || 'Failed to update')
      }
    } catch (error) {
      console.error("Hiba történt a módosítás során:", error)
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
    <div className="details">
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
              />
              <label>Result:</label>
              <input type="text" className='edit-result' value={result} onChange={(e) => setResult(e.target.value)} placeholder="X - Y" />
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
              {(user.role === 'admin') && (
                <div>
                  <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
                  <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
                </div>
              )}
              <span className="edit material-symbols-outlined" onClick={handleGuessChange}>add</span>
              {group_members.some(m => m.user_id === user?.user_id) && (
                <button className="take-away-btn" onClick={handleTakeAway}>
                  Take Away
                </button>
              )}
            </div>
          ) : (
            <span className="add material-symbols-outlined" onClick={handleJoin}>add</span>
          )}
          <p className='type type-event'>{event.type}</p>
          <h4>{event.name}</h4>
          <p><strong>Description: </strong>{event.description}</p>
          <p><strong>Event date: </strong>{moment(event.event_date).format('YYYY-MM-DD HH:mm')}</p>

          <p><strong>Group Members:</strong></p>
          <ul>
            {event.group_members.map((member, index) => {
              const userInfo = users.find(u => u._id === member.user_id);
              return (
                <li key={index}>
                  <p
                    className="member-name"
                    onClick={() => handleMemberClick(member.user_id)}
                  >
                    <b>name: </b>{userInfo ? userInfo.username : "Ismeretlen felhasználó"}
                  </p>
                  <p><i>guess: </i>{member.guess}</p>
                  {isWinner(event.result, member.guess) && <p className='winner-badge'>WINNER!</p>}
                </li>);
            })}
          </ul>
          <p className='result'><strong>Result: </strong>{event.result}</p>
          
          <p>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</p>
        </div >
      )}
    </div >
  )
}

export default EventDetails