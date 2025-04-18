import { useEffect } from 'react'
import { useEventsContext } from "../hooks/useEventsContext"
import { useAuthContext } from "../hooks/useAuthContext"

import EventDetails from '../components/EventDetails'
import EventForm from '../components/EventForm'

const Events = () => {
  const { sportevents, dispatch } = useEventsContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/sportevents', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_SPORTEVENTS', payload: json })
      }
    }

    if (user) {
      fetchEvents()
    }
  }, [dispatch, user, sportevents])

  return (
    <div className="page">
      <div>
        {sportevents && sportevents.map((event) => (
          <EventDetails key={event._id} event={event} />
        ))}
      </div>
      {(user.role === 'admin') && (
        <EventForm />
      )}
    </div>
  )
}

export default Events