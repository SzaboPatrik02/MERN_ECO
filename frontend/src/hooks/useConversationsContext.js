import { ConversationsContext } from '../context/ConversationContext'
import { useContext } from 'react'

export const useConversationsContext = () => {
    const context = useContext(ConversationsContext)

    if (!context) {
        throw Error('useConversationsContext must be used inside a useConversationsContextProvider')
    }

    return context
}