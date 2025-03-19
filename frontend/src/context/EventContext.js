import { createContext, useReducer } from "react";

export const EventsContext = createContext()

export const eventsReducer = (state, action) => {
    switch(action.type) {
        case 'SET_SPORTEVENTS':
            return {
                sportevents: action.payload
            }
        case 'CREATE_SPORTEVENT':
            return {
                sportevents: [action.payload, ...state.sportevents]
            }
        case 'DELETE_SPORTEVENT':
            return {
                sportevents: state.sportevents.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const EventsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(eventsReducer, {
        sportevents: null
    })

    

    return (
        <EventsContext.Provider value={{...state, dispatch}}>
            { children }
        </EventsContext.Provider>
    )
}