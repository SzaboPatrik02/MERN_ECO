const express = require('express')
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
  notifyByWorkout
} = require('../controllers/workoutController')
const requireAuth = require('../middleware/requireAuth')
const checkCoach = require('../middleware/checkCoach')

const router = express.Router()

router.use(requireAuth)

router.get('/', checkCoach, getWorkouts)

router.get('/:id', checkCoach, getWorkout)

router.post('/', checkCoach, createWorkout)

router.post('/:id/notify', notifyByWorkout)

router.delete('/:id', checkCoach, deleteWorkout)

router.patch('/:id', checkCoach, updateWorkout)


module.exports = router