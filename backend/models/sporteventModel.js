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
  group_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Sportevent', sporteventSchema)