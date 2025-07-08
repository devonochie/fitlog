const mongoose = require('mongoose')


const workoutTemplates = new mongoose.Schema({
   userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
   name: { type: String, required: true },
   exercises:[
      {
         name: { type: String, required: true },
         sets: { type: Number, required: true, default: 3 },  // Added default values for sets
         reps: { type: Number, required: true, default: 10 },  // Added default values for reps
         weight: { type: Number, required: true, default: 0 }  // Added default values for weight
      }, 
   ]
}, {timestamps: true})

const Templates = mongoose.model('Templates', workoutTemplates)
module.exports = Templates
