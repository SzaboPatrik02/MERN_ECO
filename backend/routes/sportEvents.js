const express = require('express')
const {
  createSportevent,
  getSportevents,
  getSportevent,
  deleteSportevent,
  updateSportevent,
  updateGuess,
  updateList
} = require('../controllers/sportEventsController')
const requireAuth = require('../middleware/requireAuth')
const checkAdmin = require('../middleware/checkAdmin')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getSportevents)

//GET a single workout
router.get('/:id', getSportevent)

// POST a new workout
router.post('/', checkAdmin, createSportevent)

// DELETE a workout
router.delete('/:id', checkAdmin, deleteSportevent)

// UPDATE a workout
router.patch('/:id', checkAdmin, updateSportevent)

router.patch('/:id/guess', updateGuess)

router.patch('/:id/list', updateList)


module.exports = router