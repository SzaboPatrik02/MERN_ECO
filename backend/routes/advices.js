const express = require('express')
const {
  createAdvice,
  getAdvices,
  getAdvice,
  deleteAdvice,
  updateAdvice
} = require('../controllers/adviceController')
const requireAuth = require('../middleware/requireAuth')
const checkCoach = require('../middleware/checkCoach')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getAdvices)

//GET a single workout
router.get('/:id', getAdvice)

// POST a new workout
router.post('/', checkCoach, createAdvice)

// DELETE a workout
router.delete('/:id', checkCoach, deleteAdvice)

// UPDATE a workout
router.patch('/:id', checkCoach, updateAdvice)


module.exports = router