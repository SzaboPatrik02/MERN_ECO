const Challenge = require('../models/challengeModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

// get all workouts
const getChallenges = async (req, res) => {
  try {
    const user_id = req.user._id; // Az aktuális felhasználó ID-ja

    const challenges = await Challenge.find({
      $or: [
        { creator_id: user_id }, // Ha a felhasználó a kihívás létrehozója
        { "group_members.user_id": user_id } // Ha benne van a csoporttagok között
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}


// get a single workout
const getChallenge = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  const challenge = await Challenge.findById(id)

  if (!challenge) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  res.status(200).json(challenge)
}


// create new workout
const createChallenge = async (req, res) => {
  const { name, description, valid_until, to_achive, group_members } = req.body

  let emptyFields = []

  if (!name) {
    emptyFields.push('name')
  }
  if (!description) {
    emptyFields.push('description')
  }
  if (!valid_until) {
    emptyFields.push('valid_until')
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
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

    const challenge = await Challenge.create({ name, description, valid_until, to_achive, group_members: members, creator_id })

    const notifications = {
      sender_id: creator_id,
      content: 'You have received a new challenge',
      related_id: challenge._id,
      received_at: new Date(),
      read: false
    }

    for (const member of group_members) {
      if (member.user_id !== creator_id) {
        await User.updateOne(
          { _id: member.user_id },
          { $push: { notifications: notifications } }
        )
      }
    }

    res.status(200).json(challenge)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a workout
const deleteChallenge = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  const challenge = await Challenge.findOneAndDelete({ _id: id })

  if (!challenge) {
    return res.status(400).json({ error: 'No such challenge' })
  }

  res.status(200).json(challenge)
}

// update a workout
const updateChallenge = async (req, res) => {
  const { id } = req.params
  const { group_members, to_achive } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' })
  }

  const challenge = await Challenge.findOneAndUpdate({ _id: id }, {
    ...req.body
  }, { new: true })

  if (!challenge) {
    return res.status(400).json({ error: 'No such workout' })
  }

  console.log("Challenge eloszor:", challenge)


  for (const member of challenge.group_members) {
    if (member.current_result === to_achive) {

      const notification = {
        sender_id: req.user._id,
        content: `Gratulálok! Teljesítetted a(z) "${challenge.name}" kihívást!`,
        related_id: id,
        received_at: new Date(),
        read: false,
        type: "challenge_completed"
      };

      await User.updateOne(
        { _id: member.user_id },
        { $push: { notifications: notification } }
      );
    }
  }
  console.log("Challenge amsodiszor:", challenge)
  res.status(200).json(challenge)
}


module.exports = {
  getChallenges,
  getChallenge,
  createChallenge,
  deleteChallenge,
  updateChallenge
}