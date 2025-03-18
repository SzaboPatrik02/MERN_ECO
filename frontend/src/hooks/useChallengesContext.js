import { ChallengesContext } from '../context/ChallengeContext'
import { useContext } from 'react'

export const useChallengesContext = () => {
    const context = useContext(ChallengesContext)

    if (!context) {
        throw Error('useChallengesContext must be used inside a useChallengesContextProvider')
    }

    return context
}