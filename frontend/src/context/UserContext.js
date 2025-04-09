import { createContext, useReducer } from "react";

export const UsersContext = createContext();

export const usersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            }
        case 'UPDATE_USER':
            if (!action.payload || !action.payload._id) {
                console.error('UPDATE_USER: Invalid payload', action.payload);
                return state;
            }

            const updatedUsers = state.users?.map(user =>
                user._id === action.payload._id ? { ...user, ...action.payload } : user
            ) || state.users;

            const newState = {
                ...state,
                users: updatedUsers
            };

            if (state.currentUser?._id === action.payload._id) {
                newState.currentUser = { ...state.currentUser, ...action.payload };
            }

            if (state.viewedUser?._id === action.payload._id) {
                newState.viewedUser = { ...state.viewedUser, ...action.payload };
            }

            return newState;
        case 'DELETE_USER':
            const isCurrentUser = state.currentUser?._id === action.payload._id;
            const isViewedUser = state.viewedUser?._id === action.payload._id;

            return {
                ...state,
                users: state.users?.filter(user => user._id !== action.payload._id),
                currentUser: isCurrentUser ? null : state.currentUser,
                viewedUser: isViewedUser ? null : state.viewedUser
            }
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
                viewedUser: null,
            }

        default:
            return state
    }
}

export const UsersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(usersReducer, {
        users: null,
        currentUser: null,
        viewedUser: null
    });

    return (
        <UsersContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UsersContext.Provider>
    )
}