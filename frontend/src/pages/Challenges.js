import { useEffect } from 'react'
import { useChallengesContext } from "../hooks/useChallengesContext"
import { useAuthContext } from "../hooks/useAuthContext"

import ChallengeDetails from '../components/ChallengeDetails'
import ChallengeForm from '../components/ChallengeForm'

const Challenges = () => {
  const { challenges, dispatch } = useChallengesContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchChallenges = async () => {
      const response = await fetch('/api/challenges', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_CHALLENGES', payload: json })
      }
    }

    if (user) {
      fetchChallenges()
    }
  }, [dispatch, user, challenges])

  return (
    <div className="page">
      <div>
        {challenges && challenges.map((challenge) => (
          <ChallengeDetails key={challenge._id} challenge={challenge} />
        ))}
      </div>
      {(user.role === 'admin') && (
        <ChallengeForm />
      )}
    </div>
  )
}

export default Challenges