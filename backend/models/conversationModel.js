const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    participants: [{
        type: String,
        required: true
    }],
    messages: [{
        content: {
            type: String,
            required: true
        },
        creator_id: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
