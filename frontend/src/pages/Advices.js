import { useEffect }from 'react'
import { useAdvicesContext } from "../hooks/useAdvicesContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import AdviceDetails from '../components/AdviceDetails'
import AdviceForm from '../components/AdviceForm'

const Advices = () => {
  const {advices, dispatch} = useAdvicesContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchAdvices = async () => {
      const response = await fetch('/api/advices', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_ADVICES', payload: json})
      }
    }

    if (user) {
      fetchAdvices()
    }
  }, [dispatch, user, advices])

  return (
    <div className="home">
      <div className="workouts">
        {advices && advices.map((advice) => (
          <AdviceDetails key={advice._id} advice={advice} />
        ))}
      </div>
      <AdviceForm />
    </div>
  )
}

export default Advices