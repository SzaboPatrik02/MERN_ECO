import { AdvicesContext } from '../context/AdviceContext'
import { useContext } from 'react'

export const useAdvicesContext = () => {
    const context = useContext(AdvicesContext)

    if (!context) {
        throw Error('useAdvicesContext must be used inside a useAdvicesContextProvider')
    }

    return context
}