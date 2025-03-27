import { useState, useEffect } from 'react'
import { useChallengesContext } from '../hooks/useChallengesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import moment from 'moment'

const ChallengeDetails = ({ challenge, isMainPage }) => {
  const { dispatch } = useChallengesContext()
  const { user } = useAuthContext()

  const [editedChallenge, setEditedChallenge] = useState(null);

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(challenge.name)
  const [description, setDescription] = useState(challenge.description)
  const [valid_until, setValid_until] = useState(challenge.valid_until)
  const [group_members, setGroup_members] = useState(challenge.group_members)
  const [creator_id, setCreator_id] = useState(challenge.creator_id)
  const [users, setUsers] = useState([]);

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

  const handleJoin = async () => {
    if (!user) return;

    if (group_members.some(member => member.user_id === user.user_id)) {
      alert("Már feliratkoztál erre a kihívásra!");
      return;
    }

    const updatedGroupMembers = [...group_members];

    const newMember = {
      user_id: user.user_id,
      joined_at: new Date().toISOString()
    };
    console.log("newMember:", newMember);

    updatedGroupMembers.push(newMember);

    const response = await fetch(`/api/challenges/${challenge._id}`, {
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
      setGroup_members(updatedGroupMembers);
      dispatch({ type: 'UPDATE_CHALLENGE', payload: json });
    } else {
      alert(json.error);
    }
  };

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
          {!isMainPage ? (
            <div>
              <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
              <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
            </div>
          ) : (
            <span className="add material-symbols-outlined" onClick={handleJoin}>add</span>
          )}
          <h4>{challenge.name}</h4>
          <p><strong>Description: </strong>{challenge.description}</p>
          <p><strong>Valid until: </strong>{moment(challenge.valid_until).format('YYYY-MM-DD HH:mm')}</p>
          <p><strong>Ratings: </strong>{challenge.ratings}</p>

          <p><strong>Group Members:</strong></p>
          <ul>
            {challenge.group_members.map((member, index) => {
              const userInfo = users.find(u => u._id === member.user_id);
              return <li key={index}>{userInfo ? userInfo.username : "Ismeretlen felhasználó"}</li>;
            })}
          </ul>
          <p>{formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}</p>
        </div >
      )}
    </div>
  )
}

export default ChallengeDetails