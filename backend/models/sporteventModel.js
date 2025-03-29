const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sporteventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  event_date: {
    type: Date,
    required: true
  },
  group_members: [
    {
      user_id: {
        type: String,
        required: true
      },
      guess: {
        type: String,
        required: false
      },
      joined_at: {
        type: Date,
        required: true
      }
    }
  ],
  result: {
    type: String,
    required: true,
    default: '...'
  },
  type: {
    type: String,
    required: true,
    default: 'sportevent'
  },
  creator_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Sportevent', sporteventSchema)