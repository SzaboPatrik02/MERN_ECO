const express = require('express')
const { getAllData } = require('../controllers/globalController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// GET all workouts
router.get('/', getAllData)

module.exports = router