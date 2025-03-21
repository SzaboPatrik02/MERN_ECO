import { createContext, useReducer } from "react";

export const AdvicesContext = createContext()

export const advicesReducer = (state, action) => {
    switch (action.type) {
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
        case 'UPDATE_ADVICE':
            return {
                advices: state.advices.map((w) =>
                    w._id === action.payload._id ? action.payload : w
                )
            }
        default:
            return state
    }
}

export const AdvicesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(advicesReducer, {
        advices: null
    })



    return (
        <AdvicesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AdvicesContext.Provider>
    )
}