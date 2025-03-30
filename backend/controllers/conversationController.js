const Conversation = require('../models/conversationModel');
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all workouts
const getConversations = async (req, res) => {
    const user_id = req.user._id

    try {
        const conversations = await Conversation.find({
            participants: { $in: [user_id] }
        }).sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

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

        if (!req.body.messages || req.body.messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is missing or empty' });
        }

        const { content } = req.body.messages[0];
        const receiver_id = req.body.receiver_id;

        if (!receiver_id || !content) {
            return res.status(400).json({ error: 'Please provide receiver_id and content in the messages array' });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [creator_id, receiver_id] }
        });

        if (conversation) {
            return res.status(400).json({ error: 'Conversation already exists' });
        }

        conversation = await Conversation.create({
            participants: [creator_id, receiver_id],
            messages: [{
                content,
                creator_id,
                timestamp: Date.now()
            }]
        });

        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    const { conversation_id, messages } = req.body;

    console.log('Request body:', req.body);
    console.log('Conversation ID:', conversation_id);
    console.log('Messages:', messages); // Ellenőrizzük a messages tömböt

    try {
        const creator_id = req.user._id;

        const conversation = await Conversation.findById(conversation_id);

        console.log('Conversation found:', conversation);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const updatedMessages = messages.map(message => ({
            content: message.content,
            creator_id: message.creator_id,
            timestamp: message.timestamp || Date.now(),
        }));

        conversation.messages = updatedMessages;
        conversation.updatedAt = new Date();

        await conversation.save();
        res.status(200).json(conversation);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getConversations,
    getConversation,
    createConversation,
    deleteConversation,
    updateConversation
}