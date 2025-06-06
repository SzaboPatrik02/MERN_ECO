const Advice = require('../models/adviceModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getAdvices = async (req, res) => {
  const user_id = req.user._id

  const advices = await Advice.find({
    $or: [
      { receiver_id: user_id },
      { creator_id: user_id }
    ]
  }).sort({ createdAt: -1 })

  res.status(200).json(advices)
}

const getAdvice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  const advice = await Advice.findById(id)

  if (!advice) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  res.status(200).json(advice)
}

const createAdvice = async (req, res) => {
  const { receiver_id, type, content } = req.body

  let emptyFields = []

  if (!receiver_id) {
    emptyFields.push('receiver_id')
  }
  if (!content) {
    emptyFields.push('content')
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  try {
    const creator_id = req.user._id
    const advice = await Advice.create({ receiver_id, content, creator_id })

    const notifications = {
      sender_id: creator_id,
      content: advice.content,
      related_id: advice._id,
      type: 'advice',
      received_at: new Date(),
      read: false
    }

    await User.updateOne(
      {_id: receiver_id },
      { $push: { notifications: notifications }}
      )

    res.status(200).json(advice)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteAdvice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  const advice = await Advice.findOneAndDelete({ _id: id })

  if (!advice) {
    return res.status(400).json({ error: 'No such challenge' })
  }

  res.status(200).json(advice)
}

const updateAdvice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  const advice = await Advice.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!advice) {
    return res.status(400).json({ error: 'No such workout' })
  }

  res.status(200).json(advice)
}


module.exports = {
  getAdvices,
  getAdvice,
  createAdvice,
  deleteAdvice,
  updateAdvice
}