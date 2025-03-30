const mongoose = require('mongoose')

const Schema = mongoose.Schema

const challengeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  valid_until: {
    type: Date,
    required: true
  },
  to_achive: {
    type: Number,
    required: true
  },
  group_members: [
    {
      user_id: {
        type: String,
        required: true
      },
      current_result: {
        type: Number,
        required: false,
        default: 0
      },
      joined_at: {
        type: Date,
        required: true
      }
    }
  ],
  type: {
    type: String,
    required: true,
    default: 'challenge'
  },
  creator_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Challenge', challengeSchema)