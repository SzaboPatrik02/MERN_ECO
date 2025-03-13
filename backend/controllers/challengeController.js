const Challenge = require('../models/challengeModel')
const mongoose = require('mongoose')

// get all workouts
const getChallenges = async (req, res) => {
  const user_id = req.user._id

  const challenges = await Challenge.find({user_id}).sort({createdAt: -1})

  res.status(200).json(challenges)
}

// get a single workout
const getChallenge = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const challenge = await Challenge.findById(id)

  if (!challenge) {
    return res.status(404).json({error: 'No such challenge'})
  }
  
  res.status(200).json(challenge)
}


// create new workout
const createChallenge = async (req, res) => {
  const {name, description, valid_until, ratings, creator, group_id } = req.body

  let emptyFields = []

  if(!name) {
    emptyFields.push('name')
  }
  if(!description) {
    emptyFields.push('description')
  }
  if(!valid_until) {
    emptyFields.push('valid_until')
  }
  if(!ratings) {
    emptyFields.push('ratings')
  }
  if(!creator) {
    emptyFields.push('creator')
  }
  if(!group_id) {
    emptyFields.push('group_id')
  }
  
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const challenge = await Challenge.create({name, description, valid_until, ratings, creator, group_id, user_id})
    res.status(200).json(challenge)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteChallenge = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const challenge = await Challenge.findOneAndDelete({_id: id})

  if (!challenge) {
    return res.status(400).json({error: 'No such challenge'})
  }

  res.status(200).json(challenge)
}

// update a workout
const updateChallenge = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const challenge = await Workout.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!challenge) {
    return res.status(400).json({error: 'No such workout'})
  }

  res.status(200).json(challenge)
}


module.exports = {
  getChallenges,
  getChallenge,
  createChallenge,
  deleteChallenge,
  updateChallenge
}