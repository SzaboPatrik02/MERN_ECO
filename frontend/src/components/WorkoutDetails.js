import { useState, useEffect } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout, isMainPage }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [editedWorkout, setEditedWorkout] = useState(null);
  const [users, setUsers] = useState([]);

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(workout.title)
  const [load, setLoad] = useState(workout.load)
  const [reps, setReps] = useState(workout.reps)

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

  const handleNotifyCreator = async () => {
    if (!user) return;

    if (user.user_id === workout.user_id) {
      alert("Saját edzésedre nem küldhetsz értesítést!");
      return;
    }
    try {
      const response = await fetch(`/api/workouts/${workout._id}/notify`, {
        method: 'POST',
        body: JSON.stringify({ joiningUserId: user.user_id }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      console.log("Szerver válasza:", json);

      if (response.ok) {
        alert("Értesítés elküldve a létrehozónak!");
      } else {
        alert(json.error);
      }
    } catch (error) {
      console.error("Hiba történt az értesítés küldése során:", error);
      alert("Hiba történt az értesítés küldése során.");
    }
  };

  const handleDelete = async () => {
    if (!user) return

    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })

    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }

  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!user) return

    const updatedWorkout = { title, load, reps }

    const response = await fetch(`/api/workouts/${workout._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedWorkout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await response.json()

    if (response.ok) {

      setIsEditing(false)

      dispatch({ type: 'UPDATE_WORKOUT', payload: json })

    }
  }

  useEffect(() => {
    if (editedWorkout) {
      setTitle(editedWorkout.title);
      setLoad(editedWorkout.load);
      setReps(editedWorkout.reps);
    }
  }, [editedWorkout])

  const creator = users.find(u => u._id === workout.user_id);

  return (
    <div className="details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <h3>Edit Workout</h3>
          <label>Exercise Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <label>Load (kg):</label>
          <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} required />
          <label>Reps:</label>
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          {!isMainPage ? (
            <div>
              <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
              <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
            </div>
          ) : (
            user.user_id !== workout.user_id && (
              <span className="add material-symbols-outlined" onClick={handleNotifyCreator}>add</span>
            )
          )}
          <p className='type type-workout'>{workout.type}</p>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p className="member-name"
            onClick={() => handleMemberClick(workout.user_id)}>
            <strong>Coach: </strong>{creator ? creator.username : "Ismeretlen felhasználó"}
          </p>

          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
        </div>
      )}
    </div>
  )
}

export default WorkoutDetails