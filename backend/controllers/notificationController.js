const Notification = require('../models/notificationModel')
const mongoose = require('mongoose')

// get all workouts
const getNotifications = async (req, res) => {
  const user_id = req.user._id

  const notifications = await Notification.find({user_id}).sort({createdAt: -1})

  res.status(200).json(notifications)
}

// get a single workout
const getNotification = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const notification = await Notification.findById(id)

  if (!notification) {
    return res.status(404).json({error: 'No such challenge'})
  }
  
  res.status(200).json(notification)
}


// create new workout
const createNotification = async (req, res) => {
  const {receiver_id, type, content } = req.body

  let emptyFields = []

  if(!receiver_id) {
    emptyFields.push('receiver_id')
  }
  if(!type) {
    emptyFields.push('type')
  }
  if(!content) {
    emptyFields.push('content')
  }
  
  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const notification = await Notification.create({receiver_id, type, content, user_id})
    res.status(200).json(notification)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a workout
const deleteNotification = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const notification = await Notification.findOneAndDelete({_id: id})

  if (!notification) {
    return res.status(400).json({error: 'No such challenge'})
  }

  res.status(200).json(notification)
}

// update a workout
const updateNotification = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such challenge'})
  }

  const notification = await Notification.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!notification) {
    return res.status(400).json({error: 'No such workout'})
  }

  res.status(200).json(notification)
}


module.exports = {
  getNotifications,
  getNotification,
  createNotification,
  deleteNotification,
  updateNotification
}