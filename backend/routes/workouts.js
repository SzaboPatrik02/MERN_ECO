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

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getWorkouts)

//GET a single workout
router.get('/:id', getWorkout)

// POST a new workout
router.post('/', checkCoach, createWorkout)

router.post('/:id/notify', notifyByWorkout)

// DELETE a workout
router.delete('/:id', checkCoach, deleteWorkout)

// UPDATE a workout
router.patch('/:id', checkCoach, updateWorkout)


module.exports = router