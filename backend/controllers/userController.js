const User = require('../models/userModel')
const Workout = require('../models/workoutModel');
const Conversation = require('../models/conversationModel');
const Sportevent = require('../models/sporteventModel');
const Challenge = require('../models/challengeModel');
const Advice = require('../models/adviceModel');

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator');


const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const getUsers = async (req, res) => {

  const users = await User.find().sort({ createdAt: -1 })

  res.status(200).json(users)
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    const token = createToken(user._id)

    res.status(200).json({ email, username: user.username, token, user_id: user._id, role: user.role, profile_picture: user.profile_picture })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const signupUser = async (req, res) => {
  const { email, username, password } = req.body

  try {
    const user = await User.signup(email, username, password)

    const token = createToken(user._id)

    res.status(200).json({ email, username, token, user_id: user._id, role: user.role,profile_picture: user.profile_picture })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Nincs ilyen felhasználó' });
  }

  try {
    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'Nincs ilyen felhasználó' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const userId = isAdmin ? req.params.id : req.user._id;
  const updateData = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const userId = isAdmin ? req.params.id : req.user._id;
  
  if (!isAdmin && req.user._id.toString() !== userId.toString()) {
    return res.status(403).json({ error: 'You are not authorized to delete this user' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Promise.all([
      
      Workout.deleteMany({ user_id: userId }),
      
      Advice.deleteMany({ $or: [{ creator_id: userId }, { receiver_id: userId }] }),

      Conversation.deleteMany({
        $or: [
          { participants: userId },
          { "messages.creator_id": userId }
        ]
      }),

      Sportevent.updateMany(
        { "group_members.user_id": userId },
        { $pull: { group_members: { user_id: userId } } }
      ),

      Challenge.updateMany(
        { "group_members.user_id": userId },
        { $pull: { group_members: { user_id: userId } } }
      )

    ]);

    res.status(200).json({ message: 'User deleted successfully' });
    console.log(`User with ID ${userId} deleted successfully`);
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(400).json({ error: error.message });
  }
};


const getNotifications = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found in request." });
    }

    const reversedNotifications = [...req.user.notifications].reverse();

    res.status(200).json(reversedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadNotifications = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.json({ count: 0 });
  }

  const unreadCount = user.notifications.filter(n => !n.read).length;
  res.json({ count: unreadCount });
};

const markAsRead = async (req, res) => {
  await User.updateOne(
    { _id: req.user._id, 'notifications._id': req.params.id },
    { $set: { 'notifications.$.read': true } }
  )
  res.sendStatus(200)
}

const deleteNotification = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found in request." });
    }

    const userId = req.user._id;
    const notificationId = req.params.id;

    await User.updateOne(
      { _id: userId },
      { $pull: { notifications: { _id: notificationId } } }
    );

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, getUser, signupUser, loginUser, updateUser, deleteUser, getNotifications, deleteNotification, getUnreadNotifications, markAsRead }