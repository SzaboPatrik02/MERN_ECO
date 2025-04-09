import { UserContext } from '../context/UserContext'
import { useContext } from 'react'

export const useWorkoutsContext = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw Error('useUsersContext must be used inside a useUsersContextProvider')
    }

    return context
}