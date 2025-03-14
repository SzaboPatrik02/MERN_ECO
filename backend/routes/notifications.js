const express = require('express')
const {
  createNotification,
  getNotifications,
  getNotification,
  deleteNotification,
  updateNotification
} = require('../controllers/notificationController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getNotifications)

//GET a single workout
router.get('/:id', getNotification)

// POST a new workout
router.post('/', createNotification)

// DELETE a workout
router.delete('/:id', deleteNotification)

// UPDATE a workout
router.patch('/:id', updateNotification)


module.exports = router