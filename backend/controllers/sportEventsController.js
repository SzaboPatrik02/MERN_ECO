const Sportevent = require('../models/sporteventModel')
const mongoose = require('mongoose')

// get all workouts
const getSportevents = async (req, res) => {
  try {
    const user_id = req.user._id; // Az aktuális felhasználó ID-ja

    const events = await Sportevent.find({
      $or: [
        { creator_id: user_id }, // Ha a felhasználó a kihívás létrehozója
        { "group_members.user_id": user_id } // Ha benne van a csoporttagok között
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

// get a single workout
const getSportevent = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' })
  }

  const event = await Sportevent.findById(id)

  if (!event) {
    return res.status(404).json({ error: 'No such event' })
  }

  res.status(200).json(event)
}


// create new workout
const createSportevent = async (req, res) => {
  const { name, description, event_date, group_members } = req.body

  let emptyFields = []

  if (!name) {
    emptyFields.push('name')
  }
  if (!description) {
    emptyFields.push('description')
  }
  if (!event_date) {
    emptyFields.push('event_date')
  }
  if (!group_members) {
    emptyFields.push('group_members')
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const creator_id = req.user._id

    const creatorUserId = creator_id
    const otherUserIds = group_members.map((member) => member.user_id)

    const members = [{
      user_id: creatorUserId,
      joined_at: new Date()
    }];

    if (otherUserIds && otherUserIds.length > 0) {
      otherUserIds.forEach((userId) => {
        members.push({
          user_id: userId,
          joined_at: new Date()
        });
      });
    }

    const event = await Sportevent.create({ name, description, event_date, group_members: members, creator_id })
    res.status(200).json(event)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a workout
const deleteSportevent = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' })
  }

  const event = await Sportevent.findOneAndDelete({ _id: id })

  if (!event) {
    return res.status(400).json({ error: 'No such event' })
  }

  res.status(200).json(event)
}

// update a workout
const updateSportevent = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' })
  }

  const event = await Sportevent.findOneAndUpdate({ _id: id }, {
    ...req.body
  })

  if (!event) {
    return res.status(400).json({ error: 'No such event' })
  }

  res.status(200).json(event)
}


module.exports = {
  getSportevents,
  getSportevent,
  createSportevent,
  deleteSportevent,
  updateSportevent
}