const express = require('express')
const {
  createChallenge,
  getChallenges,
  getChallenge,
  deleteChallenge,
  updateChallenge,
  updateCurrentResult,
  updateList
} = require('../controllers/challengeController')
const requireAuth = require('../middleware/requireAuth')
const checkAdmin = require('../middleware/checkAdmin')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getChallenges)

//GET a single workout
router.get('/:id', getChallenge)

// POST a new workout
router.post('/', checkAdmin, createChallenge)

// DELETE a workout
router.delete('/:id', checkAdmin, deleteChallenge)

// UPDATE a workout
router.patch('/:id', checkAdmin, updateChallenge)

router.patch('/:id/currentresult', updateCurrentResult)

router.patch('/:id/list', updateList)


module.exports = router