const express = require('express')

// controller functions
const { loginUser, signupUser, getNotifications, deleteNotification, getUsers } = require('../controllers/userController')
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

//router.delete('/:id', deleteNotification)
router.delete('/notifications/:id', deleteNotification)

module.exports = router