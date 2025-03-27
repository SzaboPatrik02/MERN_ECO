const Challenge = require('../models/challengeModel')
const Sportevent = require('../models/sporteventModel')
const Workout = require('../models/workoutModel')

const getAllData = async (req, res) => {
    try {
        const challenges = await Challenge.find()
        const sportevents = await Sportevent.find()
        const workouts = await Workout.find()

        const allData = [...challenges, ...sportevents, ...workouts]

        allData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message })
    }
}

module.exports = { getAllData }