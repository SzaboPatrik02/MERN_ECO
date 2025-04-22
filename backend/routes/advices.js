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

router.use(requireAuth)

router.get('/', checkCoach, getAdvices)

router.get('/:id', checkCoach, getAdvice)

router.post('/', checkCoach, createAdvice)

router.delete('/:id', checkCoach, deleteAdvice)

router.patch('/:id', checkCoach, updateAdvice)


module.exports = router