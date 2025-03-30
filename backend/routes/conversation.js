const express = require('express')
const {
    getConversations,
    getConversation,
    createConversation,
    deleteConversation,
    updateConversation
} = require('../controllers/conversationController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getConversations)

router.get('/:id', getConversation)

router.post('/', createConversation)

router.delete('/:id', deleteConversation)

router.patch('/:id', updateConversation)

module.exports = router