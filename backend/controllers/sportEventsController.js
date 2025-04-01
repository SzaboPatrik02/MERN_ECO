const Sportevent = require('../models/sporteventModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getSportevents = async (req, res) => {
  try {
    const user_id = req.user._id;

    const events = await Sportevent.find({
      $or: [
        { creator_id: user_id },
        { "group_members.user_id": user_id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

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

  try {
    const creator_id = req.user._id

    const creatorUserId = creator_id
    const otherUserIds = group_members.map((member) => member.user_id)

    const members = []

    if (!otherUserIds.some(userId => userId.toString() === creatorUserId.toString())) {
      members.push({
        user_id: creatorUserId,
        joined_at: new Date()
      });
    }

    otherUserIds.forEach(userId => {
      members.push({
        user_id: userId,
        joined_at: new Date()
      });
    });

    const event = await Sportevent.create({ name, description, event_date, group_members: members, creator_id })

    const notifications = {
      sender_id: creator_id,
      content: 'You have received a new event',
      related_id: event._id,
      received_at: new Date(),
      read: false
    }

    for (const member of group_members) {
      await User.updateOne(
        { _id: member.user_id },
        { $push: { notifications: notifications } }
      )
    }

    res.status(200).json(event)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

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

const updateSportevent = async (req, res) => {
  const { id } = req.params
  const { group_members, result } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' })
  }

  const event = await Sportevent.findOneAndUpdate({ _id: id }, {
    ...req.body,
  }, { new: true });

  if (!event) {
    return res.status(400).json({ error: 'No such event' })
  }

  if (result && result !== '...') {
    for (const member of event.group_members) {
      let notificationContent = `A(z) "${event.name}" esemény eredménye: ${result}.`;

      if (member.guess === result) {
        notificationContent += ' Eltaláltad a tippet!';
      }

      const notification = {
        sender_id: req.user._id,
        content: notificationContent,
        related_id: id,
        received_at: new Date(),
        read: false,
        type: "sport_event_result",
      };

      await User.updateOne(
        { _id: member.user_id },
        { $push: { notifications: notification } }
      );
    }
  }

  res.status(200).json(event)
}

const updateGuess = async (req, res) => {
  const { id } = req.params
  const { guess } = req.body
  const user_id = req.user._id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' })
  }

  try {
    const event = await Sportevent.findOneAndUpdate(
      { 
        _id: id,
        'group_members.user_id': user_id 
      },
      { 
        $set: { 'group_members.$.guess': guess } 
      },
      { new: true }
    )

    if (!event) {
      return res.status(404).json({ error: 'Event not found or you are not a member' })
    }

    res.status(200).json(event)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateList = async (req, res) => {
  const { id } = req.params;
  const { group_members } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such event' });
  }

  try {
    
    const updateData = { group_members };
    
    const event = await Sportevent.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ error: 'No such event' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getSportevents,
  getSportevent,
  createSportevent,
  deleteSportevent,
  updateSportevent,
  updateGuess,
  updateList
}