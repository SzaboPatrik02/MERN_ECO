import { useEffect }from 'react'
import { useConversationsContext } from "../hooks/useConversationsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import ConversationDetails from '../components/ConversationDetails'
import ConversationForm from '../components/ConversationForm'

const Conversations = () => {
  const {conversations, dispatch} = useConversationsContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch('/api/conversations', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_CONVERSATIONS', payload: json})
      }
    }

    if (user) {
        fetchConversations()
    }
  }, [dispatch, user, conversations])

  return (
    <div className="home">
      <div className="workouts">
        {conversations && conversations.map((conversation) => (
          <ConversationDetails key={conversation._id} conversation={conversation} />
        ))}
      </div>
      <ConversationForm />
    </div>
  )
}

export default Conversations