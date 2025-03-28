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
  ratings: {
    type: Number,
    required: false
  },
  group_members: [
    {
      user_id: {
        type: String,
        required: true
      },
      current_result: {
        type: String,
        required: false
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