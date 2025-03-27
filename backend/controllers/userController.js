const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const getUsers = async (req, res) => {

  const users = await User.find().sort({createdAt: -1})

  res.status(200).json(users)
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, username: user.username, token, user_id: user._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, username, password } = req.body

  try {
    const user = await User.signup(email, username, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, username, token, user_id: user._id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getNotifications = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found in request." });
    }

    res.status(200).json(req.user.notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

module.exports = { getUsers, signupUser, loginUser, getNotifications, deleteNotification }