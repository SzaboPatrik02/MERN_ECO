const Challenge = require('../models/challengeModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

const getChallenges = async (req, res) => {
  try {
    const user_id = req.user._id;

    const challenges = await Challenge.find({
      $or: [
        { creator_id: user_id },
        { "group_members.user_id": user_id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

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

const updateCurrentResult = async (req, res) => {
  const { id } = req.params;
  const { current_result } = req.body;
  const user_id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' });
  }

  try {
    // 1. Dokumentum lekérése
    const challenge = await Challenge.findById(id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    // 2. Tag keresése
    const member = challenge.group_members.find(m => 
      m.user_id.toString() === user_id.toString()
    );
    if (!member) return res.status(403).json({ error: 'Not a member' });

    // 3. Érték frissítése
    member.current_result = current_result;
    await challenge.save();

    // 4. Értesítés küldése
    if (current_result >= challenge.to_achive) {
      const notification = {
        sender_id: user_id,
        content: `Gratulálok! Teljesítetted a(z) "${challenge.name}" kihívást!`,
        related_id: id,
        received_at: new Date(),
        read: false,
        type: "challenge_completed"
      };

      await User.findByIdAndUpdate(
        user_id,
        { $push: { notifications: notification } }
      );
    }

    res.status(200).json(challenge);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
};


const updateList = async (req, res) => {
  const { id } = req.params;
  const { group_members } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such challenge' });
  }

  try {

    const updateData = { group_members };

    const challenge = await Challenge.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!challenge) {
      return res.status(400).json({ error: 'No such challenge' });
    }

    res.status(200).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getChallenges,
  getChallenge,
  createChallenge,
  deleteChallenge,
  updateChallenge,
  updateCurrentResult,
  updateList
}