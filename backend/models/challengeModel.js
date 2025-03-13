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
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  group_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Challenge', challengeSchema)