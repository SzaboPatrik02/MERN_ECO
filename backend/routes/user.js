const express = require('express')

const { loginUser, signupUser, updateUser, deleteUser, getNotifications, deleteNotification, getUser, getUsers, getUnreadNotifications, markAsRead } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.use(requireAuth)

router.get('/notifications', getNotifications)
router.get('/notifications/unread', getUnreadNotifications)
router.patch('/notifications/:id/read', markAsRead)
router.delete('/notifications/:id', deleteNotification)

router.get('/', getUsers)
router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.delete('/:id/delete/delete', deleteUser)

module.exports = router