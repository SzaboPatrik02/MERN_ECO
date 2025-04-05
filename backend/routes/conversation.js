const express = require('express')
const {
    getConversations,
    getConversation,
    createConversation,
    deleteConversation,
    updateConversation,
    getUnreadMessages,
    markAsRead,
} = require('../controllers/conversationController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getConversations)

router.get('/unread', getUnreadMessages)

router.get('/:id', getConversation)

router.post('/', createConversation)

router.delete('/:id', deleteConversation)

router.patch('/:id', updateConversation)

router.patch('/:id/read', markAsRead)

module.exports = router