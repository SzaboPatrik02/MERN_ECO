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

router.use(requireAuth)

router.get('/', getChallenges)

router.get('/:id', getChallenge)

router.post('/', checkAdmin, createChallenge)

router.delete('/:id', checkAdmin, deleteChallenge)

router.patch('/:id', checkAdmin, updateChallenge)

router.patch('/:id/currentresult', updateCurrentResult)

router.patch('/:id/list', updateList)


module.exports = router