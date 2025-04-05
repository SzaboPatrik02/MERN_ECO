const express = require('express')

// controller functions
const { loginUser, signupUser, getNotifications, deleteNotification, getUsers, getUnreadNotifications, markAsRead } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// require auth for all user routes
router.use(requireAuth)

router.get('/', getUsers)

// get notifications route
router.get('/notifications', getNotifications)
router.get('/notifications/unread', getUnreadNotifications)
router.patch('/notifications/:id/read', markAsRead)

//router.delete('/:id', deleteNotification)
router.delete('/notifications/:id', deleteNotification)

module.exports = router