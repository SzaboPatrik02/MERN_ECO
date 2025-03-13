const express = require('express')
const {
  createSportevent,
  getSportevents,
  getSportevent,
  deleteSportevent,
  updateSportevent
} = require('../controllers/sportEventsController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getSportevents)

//GET a single workout
router.get('/:id', getSportevent)

// POST a new workout
router.post('/', createSportevent)

// DELETE a workout
router.delete('/:id', deleteSportevent)

// UPDATE a workout
router.patch('/:id', updateSportevent)


module.exports = router