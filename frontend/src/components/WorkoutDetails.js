import { useState, useEffect } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [editedWorkout, setEditedWorkout] = useState(null);

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(workout.title)
  const [load, setLoad] = useState(workout.load)
  const [reps, setReps] = useState(workout.reps)
  //const [error, setError] = useState(null)

  // TÖRLÉS (DELETE)
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

  // SZERKESZTÉS (PATCH)
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
    console.log("Szerver válasz:", json);

    if (response.ok) {

      setIsEditing(false)

      dispatch({ type: 'UPDATE_WORKOUT', payload: json })
      
    }
  }

  useEffect(() => {
    if (editedWorkout) { // Ha az editedWorkout state megváltozik
      setTitle(editedWorkout.title);
      setLoad(editedWorkout.load);
      setReps(editedWorkout.reps);
    }
  }, [editedWorkout])

  return (
    <div className="workout-details">
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
        <span className="del material-symbols-outlined" onClick={handleDelete}>delete</span>
        <span className="upd material-symbols-outlined" onClick={() => setIsEditing(true)}>update</span>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <div>
          
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutDetails