const Workout = require('../models/workoutModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getWorkouts = async (req, res) => {
  const user_id = req.user._id

  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })

  res.status(200).json(workouts)
}

const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}

const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!load) {
    emptyFields.push('load')
  }
  if (!reps) {
    emptyFields.push('reps')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  try {
    const user_id = req.user._id
    const workout = await Workout.create({ title, load, reps, user_id })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findOneAndDelete({ _id: id })

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}

const updateWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }

  const workout = await Workout.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!workout) {
    return res.status(400).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}

const notifyByWorkout = async (req, res) => {
  const { id } = req.params;
  const { joiningUserId } = req.body;

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ error: 'A workout nem található.' });
    }

    if (req.user._id.toString() === workout.user_id) {
      return res.status(400).json({ error: "Saját edzésedre nem küldhetsz értesítést!" });
    }

    const joiningUser = await User.findById(joiningUserId);
    if (!joiningUser) {
      return res.status(404).json({ error: 'A csatlakozó felhasználó nem található.' });
    }

    const notification = {
      sender_id: joiningUserId,
      content: `${joiningUser.username} érdeklődik a ${workout.title} edzésed iránt!`,
      related_id: id,
      type: 'workout',
      received_at: new Date(),
      read: false
    };

    await User.updateOne(
      { _id: workout.user_id },
      { $push: { notifications: notification } }
    );

    res.status(200).json({ message: 'Értesítés elküldve.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  notifyByWorkout
}