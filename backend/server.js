require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const globalRoutes = require('./routes/global')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const challengeRoutes = require('./routes/challenges')
const sportEventRoutes = require('./routes/sportEvents')
const adviceRoutes = require('./routes/advices')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api', globalRoutes);
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.use('/api/challenges', challengeRoutes)
app.use('/api/sportevents', sportEventRoutes)
app.use('/api/advices', adviceRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })