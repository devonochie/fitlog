const mongoose = require('mongoose')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const connectDB = require('./config/db')
const tempRoutes = require('./routes/tempRoutes')
const rateLimit = require('express-rate-limit')


//database connection
connectDB()
// middleware connection for app
const app = express()
app.use(express.json())
//routes for authentication of users
app.use('/api/auth', authRoutes)
// routes for workout schedules
app.use('/api/workouts', workoutRoutes)
//routes for templates
app.use('/api/templates', tempRoutes)


// global rate limiter 
const globalLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // Limit each IP to 100 requests per windowMs
   message: 'Too many requests from this IP, please try again later'
 });
 
 app.use(globalLimiter);
 
//Port for connection to database
const PORT = process.env.PORT ||5000
// Server connection
app.listen(PORT, () => {
   console.log('Server is running at localhost:',5000)
})
