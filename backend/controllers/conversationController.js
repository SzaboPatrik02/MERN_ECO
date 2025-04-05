const Conversation = require('../models/conversationModel');
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getConversations = async (req, res) => {
    const user_id = req.user._id;

    try {
        const conversations = await Conversation.find({
            participants: user_id
        }).sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getConversation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid conversation ID' });
    }

    try {
        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createConversation = async (req, res) => {
    try {
        const creator_id = req.user._id;
        const { messages, receiver_id } = req.body;

        if (!receiver_id) {
            return res.status(400).json({
                error: 'Receiver ID is required'
            });
        }

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                error: 'Messages array is required'
            });
        }

        for (const message of messages) {
            if (!message.content || typeof message.content !== 'string') {
                return res.status(400).json({
                    error: 'Message content is required and must be a string'
                });
            }
        }

        const participants = [creator_id, receiver_id];

        const existingConversation = await Conversation.findOne({
            participants: { $all: participants, $size: participants.length }
        });

        if (existingConversation) {
            return res.status(400).json({
                error: 'Conversation already exists',
                conversation: existingConversation
            });
        }

        const initialMessages = messages.map(msg => ({
            content: msg.content,
            creator_id: msg.creator_id || creator_id,
            timestamp: msg.timestamp || Date.now()
        }));

        const conversation = await Conversation.create({
            participants: participants,
            messages: initialMessages,
            read: false
        });

        res.status(201).json(conversation);

    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({
            error: 'Failed to create conversation',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const deleteConversation = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid conversation ID' });
    }

    try {
        const conversation = await Conversation.findByIdAndDelete(id);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateConversation = async (req, res) => {
    const { id } = req.params;
    const { messages } = req.body;

    try {
        const conversation = await Conversation.findOne({
            _id: id,
            participants: req.user._id
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const newMessages = messages.map(msg => ({
            content: msg.content,
            creator_id: msg.creator_id || req.user._id,
            timestamp: msg.timestamp || Date.now()
        }));

        // Megkeressük a másik résztvevőt (fogadót)
        const receiverId = conversation.participants.find(
            participant => participant.toString() !== req.user._id.toString()
        );

        // Ha van fogadó és a felhasználó a küldő
        if (receiverId && newMessages.some(msg => msg.creator_id.toString() === req.user._id.toString())) {
            conversation.read = false; // Olvasatlanná tesszük a fogadó számára
        }

        conversation.messages = [...conversation.messages, ...newMessages];

        await conversation.save();
        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUnreadMessages = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId,
            read: false
        });

        let unreadCount = 0;

        conversations.forEach(convo => {
            if (convo.messages.length > 0) {
                const lastMessageCreatorId = convo.messages[convo.messages.length - 1].creator_id;

                if (lastMessageCreatorId.toString() !== userId.toString()) {
                    unreadCount++;
                }
            }
        });

        res.json({ count: unreadCount });
    } catch (error) {
        console.error("Error getting unread messages:", error);
        res.status(500).json({ error: error.message });
    }
};


const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const conversation = await Conversation.findOne({
            _id: id,
            participants: userId
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found or access denied" });
        }

        // a bejelentkezett felhasználó kapta-e az utolsó üzenetet
        if (conversation.messages.length > 0 && conversation.messages[conversation.messages.length - 1].creator_id.toString() !== userId.toString()) {
            conversation.read = true;
            await conversation.save();
            return res.sendStatus(200);
        } else {
            return res.status(403).json({ error: "Csak az jelölheti olvasottként, aki az utolsó üzenetet kapta." });
        }

    } catch (error) {
        console.error("Error in markAsRead:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getConversations,
    getConversation,
    createConversation,
    deleteConversation,
    updateConversation,
    getUnreadMessages,
    markAsRead
}