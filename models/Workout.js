const mongoose = require('mongoose')


const workoutSchema = new mongoose.Schema({
   userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
   exercises:[
      {
         name: {type: String, required : true},
         plannedSets: {type:Number},
         plannedReps: {type:Number},
         plannedWeight: {type:Number},
         completedSets: {type:Number},  // Tracking completed sets
         completedReps:  {type:Number},  // Tracking completed reps
         completedWeight: {type:Number}
      }, 
   ],
   scheduledAt: {type: Date ,  default: Date.now},
   completedAt: {type: Date },
   comments: {type: String}
}, {timestamps: true})

const Workout = mongoose.model('Workout', workoutSchema)
module.exports = Workout
