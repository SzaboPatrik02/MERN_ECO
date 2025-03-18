import { createContext, useReducer } from "react";

export const ChallengesContext = createContext()

export const challengesReducer = (state, action) => {
    switch(action.type) {
        case 'SET_CHALLENGES':
            return {
                challenges: action.payload
            }
        case 'CREATE_CHALLENGE':
            return {
                challenges: [action.payload, ...state.challenges]
            }
        case 'DELETE_CHALLENGE':
            return {
                challenges: state.challenges.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const ChallengesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(challengesReducer, {
        challenges: null
    })

    

    return (
        <ChallengesContext.Provider value={{...state, dispatch}}>
            { children }
        </ChallengesContext.Provider>
    )
}