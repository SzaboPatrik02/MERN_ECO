const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt')
const validator = require('validator');

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  notifications: [
    {
      sender_id: String,
      content: String,
      related_id: ObjectId,
      type: {
        type: String,
        required: false,
      },
      received_at: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ],
  profile_picture: {
    type: String,
    default: '/jpg.jpg'
  },
  about: {
    introduction: {
      type: String,
      required: false,
    },
    fav_sport: {
      type: String,
      required: false,
    }
  },
  activity: {
    last_completed_challenge: {
      type: String,
      required: false,
    },
    upcoming_event: {
      type: String,
      required: false,
    }
  }
}, { timestamps: true })

userSchema.statics.signup = async function (email, username, password) {

  console.log('Signup request data:', { email, username, password });

  if (!email || !username || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const emailExists = await this.findOne({ email })
  if (emailExists) {
    throw Error('Email already in use')
  }

  const usernameExists = await this.findOne({ username })
  if (usernameExists) {
    throw Error('Username already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, username, password: hash })

  return user
}

userSchema.statics.login = async function (email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)