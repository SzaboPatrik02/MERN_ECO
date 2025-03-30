import { createContext, useReducer } from "react";

export const ConversationsContext = createContext()

export const conversationsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CONVERSATIONS':
            return {
                conversations: action.payload
            }
        case 'CREATE_CONVERSATION':
            return {
                conversations: [action.payload, ...state.conversations]
            }
        case 'DELETE_CONVERSATION':
            return {
                conversations: state.conversations.filter((w) => w._id !== action.payload._id)
            }
        case 'UPDATE_CONVERSATION':
            return {
                conversations: state.conversations.map((w) =>
                    w._id === action.payload._id ? action.payload : w
                )
            }
        default:
            return state
    }
}

export const ConversationsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(conversationsReducer, {
        conversations: null
    })



    return (
        <ConversationsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ConversationsContext.Provider>
    )
}