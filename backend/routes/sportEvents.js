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

router.use(requireAuth)

router.get('/', getSportevents)

router.get('/:id', getSportevent)

router.post('/', checkAdmin, createSportevent)

router.delete('/:id', checkAdmin, deleteSportevent)

router.patch('/:id', checkAdmin, updateSportevent)

router.patch('/:id/guess', updateGuess)

router.patch('/:id/list', updateList)


module.exports = router