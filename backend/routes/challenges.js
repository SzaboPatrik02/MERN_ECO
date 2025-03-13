const express = require('express')
const {
  createChallenge,
  getChallenges,
  getChallenge,
  deleteChallenge,
  updateChallenge
} = require('../controllers/challengeController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getChallenges)

//GET a single workout
router.get('/:id', getChallenge)

// POST a new workout
router.post('/', createChallenge)

// DELETE a workout
router.delete('/:id', deleteChallenge)

// UPDATE a workout
router.patch('/:id', updateChallenge)


module.exports = router