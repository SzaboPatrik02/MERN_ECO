import { NotificationsContext } from '../context/NotificationContext'
import { useContext } from 'react'

export const useNotificationsContext = () => {
    const context = useContext(NotificationsContext)

    if (!context) {
        throw Error('useNotificationsContext must be used inside a useNotificationsContextProvider')
    }

    return context
}