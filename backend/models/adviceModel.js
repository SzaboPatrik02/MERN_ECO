const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adviceSchema = new Schema({
  receiver_id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creator_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Advice', adviceSchema)