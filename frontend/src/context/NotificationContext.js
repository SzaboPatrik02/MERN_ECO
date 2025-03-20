import { createContext, useReducer } from "react";

export const NotificationsContext = createContext()

export const notificationsReducer = (state, action) => {
    switch(action.type) {
        case 'SET_NOTIFICATIONS':
            return {
                notifications: action.payload
            }
        case 'CREATE_NOTIFICATION':
            return {
                notifications: [action.payload, ...state.notifications]
            }
        case 'DELETE_NOTIFICATION':
            return {
                notifications: state.notifications.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const NotificationsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationsReducer, {
        notifications: null
    })

    

    return (
        <NotificationsContext.Provider value={{...state, dispatch}}>
            { children }
        </NotificationsContext.Provider>
    )
}