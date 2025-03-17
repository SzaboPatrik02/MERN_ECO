import { createContext, useReducer } from "react";

export const AdvicesContext = createContext()

export const advicesReducer = (state, action) => {
    switch(action.type) {
        case 'SET_ADVICES':
            return {
                advices: action.payload
            }
        case 'CREATE_ADVICE':
            return {
                advices: [action.payload, ...state.advices]
            }
        case 'DELETE_ADVICE':
            return {
                advices: state.advices.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const AdvicesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(advicesReducer, {
        workouts: null
    })

    

    return (
        <AdvicesContext.Provider value={{...state, dispatch}}>
            { children }
        </AdvicesContext.Provider>
    )
}