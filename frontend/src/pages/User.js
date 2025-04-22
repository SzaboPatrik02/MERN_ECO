import { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const User = () => {
  const { user: authUser, dispatch: authDispatch } = useAuthContext()
  const { userId } = useParams()
  const isCurrentUser = authUser?.user_id === userId

  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [profile_picture, setProfile_picture] = useState('')
  const [aboutIntro, setAboutIntro] = useState('')
  const [favSport, setFavSport] = useState('')
  const [lastChallenge, setLastChallenge] = useState('')
  const [upcomingEvent, setUpcomingEvent] = useState('')

  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) return

      try {
        const response = await fetch(`/api/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${authUser.token}` },
        })

        const json = await response.json()

        if (response.ok) {
          setUser(json)
          authDispatch({ type: 'SET_CURRENT_USER', payload: json })

          setUsername(json.username)
          setEmail(json.email)
          setAboutIntro(json.about?.introduction || '')
          setFavSport(json.about?.fav_sport || '')
          setLastChallenge(json.activity?.last_completed_challenge || '')
          setUpcomingEvent(json.activity?.upcoming_event || '')
          setRole(json.role || 'user');
          setProfile_picture(json.profile_picture)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [authUser, authDispatch])

  const handleMemberClick = (memberId) => {
    navigate('/conversations', {
      state: {
        receiverId: memberId,
        presetMessage: "Szia",
        isRedirect: true
      }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault()

    const updatedUser = {
      username,
      email,
      role,
      profile_picture,
      about: {
        introduction: aboutIntro,
        fav_sport: favSport,
      },
      activity: {
        last_completed_challenge: lastChallenge,
        upcoming_event: upcomingEvent,
      },
    }

    try {
      const response = await fetch(`/api/user/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(updatedUser),
      })

      const json = await response.json()

      if (response.ok) {
        setUser(json)
        setIsEditing(false)
        if (authUser.user_id === userId) {
          const updatedAuthUser = {
            ...authUser,
            ...json
          }
          localStorage.setItem('user', JSON.stringify(updatedAuthUser))
          authDispatch({ type: 'LOGIN', payload: updatedAuthUser })
        }
        
      }
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this user?")
    if (!confirmed) return

    try {
      const response = await fetch(`/api/user/${user._id}/delete/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      })

      if (response.ok) {
        if (authUser.user_id === user._id) {
          localStorage.removeItem('user');
          authDispatch({ type: 'LOGOUT' });
          window.location.href = '/login';
        } else {
          authDispatch({ type: 'DELETE_USER', payload: { _id: user._id } });
          alert('User deleted successfully');
          navigate('/')
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.error} - belso`)
      }
    } catch (err) {
      console.error("Error deleting user:", err)
      alert("Unexpected error occurred.-kulso")
    }
  }

  function previewfiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setProfile_picture(reader.result);
    }
    console.log(profile_picture);
  }
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    previewfiles(file);

  }

  if (!user) {
    return <div className="loading">Loading user data...</div>
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <img src={user.profile_picture} />
          <h2 className='usernametop'>{user.username}</h2>
          <p className="email">{user.email}</p>
          <p className="member-since">
            Member since: {format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm')}
          </p>
          <p className="role">Role: {user.role}</p>



          {(authUser?.user_id === user._id || authUser?.role === 'admin') && (
            <div>
              <button onClick={() => setIsEditing(!isEditing)} className="edit-profile-btn">
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>

              <button
                onClick={handleDelete}
                className="delete-profile-btn"
                style={{ backgroundColor: '#d9534f', color: 'white', marginTop: '10px' }}
              >
                Delete Profile
              </button>
            </div>
          )}

        </div>
      </div>

      {isEditing ? (
        <form className="edit-form" onSubmit={handleUpdate}>
          <h3>Edit Profile</h3>

          <label>Username:</label>
          <input type="text" className='username' value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Email:</label>
          <input type="email" className='email' value={email} onChange={(e) => setEmail(e.target.value)} />

          {(authUser?.user_id !== user._id && authUser?.role === 'admin') && (
            <div>
              <label>Role:</label>
              <select value={role} className='role' onChange={(e) => setRole(e.target.value)}>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="coach">coach</option>
              </select>
            </div>
          )}

          <label htmlFor='fileInput'>Upload photo</label>
          <input type='file' id='fileInput' onChange={e => handleChange(e)} accept="image/png, image/jpeg, image/jpg" />

          <label>Introduction:</label>
          <input value={aboutIntro} className='intro' onChange={(e) => setAboutIntro(e.target.value)} />

          <label>Favorite Sport:</label>
          <input type="text" className='favsport' value={favSport} onChange={(e) => setFavSport(e.target.value)} />

          <label>Last Completed Challenge:</label>
          <input type="text" className='lastchal' value={lastChallenge} onChange={(e) => setLastChallenge(e.target.value)} />

          <label>Upcoming Event:</label>
          <input type="text" className='nextevent' value={upcomingEvent} onChange={(e) => setUpcomingEvent(e.target.value)} />

          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-sections">
          <section className="about-section">
            <h3>About Me</h3>
            <p>{user.about?.introduction || 'No introduction yet'}</p>

            <div className="fav-sport">
              <h4>Favorite Sport:</h4>
              <p>{user.about?.fav_sport || 'Not specified'}</p>
            </div>
          </section>

          <section className="activity-section">
            <h3>My Activity</h3>

            <div className="last-challenge">
              <h4>Last Completed Challenge:</h4>
              <p>{user.activity?.last_completed_challenge || 'No challenges completed yet'}</p>
            </div>

            <div className="upcoming-event">
              <h4>Upcoming Event:</h4>
              <p>{user.activity?.upcoming_event || 'No upcoming events'}</p>
            </div>
          </section>

          <button onClick={() => handleMemberClick(userId)} className="send-message-btn">
            Send message
          </button>

        </div>
      )}
    </div>
  )
}

export default User
