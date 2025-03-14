const Advice = require('../models/adviceModel')
const mongoose = require('mongoose')

// get all workouts
const getAdvices = async (req, res) => {
  const user_id = req.user._id

  const advices = await Advice.find({user_id}).sort({createdAt: -1})

  res.status(200).json(advices)
}

// get a single workout
const getAdvice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const advice = await Advice.findById(id)

  if (!advice) {
    return res.status(404).json({error: 'No such challenge'})
  }
  
  res.status(200).json(advice)
}


// create new workout
const createAdvice = async (req, res) => {
  const {receiver_id, type, content } = req.body

  let emptyFields = []

  if(!receiver_id) {
    emptyFields.push('name')
  }
  if(!type) {
    emptyFields.push('description')
  }
  if(!content) {
    emptyFields.push('valid_until')
  }
  
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const advice = await Advice.create({receiver_id, type, content, user_id})
    res.status(200).json(advice)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteAdvice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const advice = await Advice.findOneAndDelete({_id: id})

  if (!advice) {
    return res.status(400).json({error: 'No such challenge'})
  }

  res.status(200).json(advice)
}

// update a workout
const updateAdvice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const advice = await Advice.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!advice) {
    return res.status(400).json({error: 'No such workout'})
  }

  res.status(200).json(advice)
}


module.exports = {
  getAdvices,
  getAdvice,
  createAdvice,
  deleteAdvice,
  updateAdvice
}