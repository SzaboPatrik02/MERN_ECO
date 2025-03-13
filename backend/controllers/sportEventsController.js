const Sportevent = require('../models/sporteventModel')
const mongoose = require('mongoose')

// get all workouts
const getSportevents = async (req, res) => {
  const user_id = req.user._id

  const events = await Sportevent.find({user_id}).sort({createdAt: -1})

  res.status(200).json(events)
}

// get a single workout
const getSportevent = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such event'})
  }

  const event = await Sportevent.findById(id)

  if (!event) {
    return res.status(404).json({error: 'No such event'})
  }
  
  res.status(200).json(event)
}


// create new workout
const createSportevent = async (req, res) => {
  const {name, description, event_date, group_id } = req.body

  let emptyFields = []

  if(!name) {
    emptyFields.push('name')
  }
  if(!description) {
    emptyFields.push('description')
  }
  if(!event_date) {
    emptyFields.push('event_date')
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
    const event = await Sportevent.create({name, description, event_date, group_id, user_id})
    res.status(200).json(event)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteSportevent = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such event'})
  }

  const event = await Sportevent.findOneAndDelete({_id: id})

  if (!event) {
    return res.status(400).json({error: 'No such event'})
  }

  res.status(200).json(event)
}

// update a workout
const updateSportevent = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such event'})
  }

  const event = await Sportevent.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!event) {
    return res.status(400).json({error: 'No such event'})
  }

  res.status(200).json(event)
}


module.exports = {
  getSportevents,
  getSportevent,
  createSportevent,
  deleteSportevent,
  updateSportevent
}