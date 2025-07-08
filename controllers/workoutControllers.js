const Workout = require("../models/Workout");
const sendEmail = require("../utils/sendEmail");
const workoutEmail = require("../utils/workoutEmail");

const createWorkout = async (req, res) => {
   const { exercises, scheduledAt, comments} = req.body
   try {
      const workout = new Workout({
         userId: req.user.userId,
         exercises,
         scheduledAt,
         comments
      })
      await workout.save()
      res.status(201).json({success: true, message: 'Workout Created Successfully'})
   } catch (error) {
      res.status(500).json({success: false, message:'Error creating Workout', error})
   }
}


const getWorkouts = async (req, res) => {
   const page = parseInt(req.query.page || 1)
   const limit = parseInt(req.query.limit || 10)

   const skip = (page - 1) * limit
   try {
      const workouts = await Workout.findById({userId: req.user._id}).populate('exercises').skip(skip).limit(limit).sort({scheduledAt: 1})
      const totalWorkout = await Workout.countDocuments({userId: req.user._id})
      if(!workouts){
         return res.status(404).json({success: false, message: 'Workouts not found'})
      }
      res.status(200).json({success: true, workouts, currentPage : page, totalPages : Math.ceil(totalWorkout/limit)})
   } catch (error) {
      console.error('Error getting user workouts:', error);
      res.status(500).json({success: false, message: 'Error getting users workout', error})
   }
}

const logProcess = async (req, res) => {
   const { exercise, completedAt } = req.body
   try {
      const workout = await Workout.findOneAndUpdate( { _id: req.params.id }, {exercise, completedAt}, {new: true, runValidators: true})
      if(!workout){
         return res.status(404).json({success: false, message: 'Workout not found'})
      }
      res.status(201).json({success: true, message: "workout succesfull updated", workout})
   } catch (error) {
      res.status(500).json({success: false, message: 'Error updating excercise', error})
   }
}

const getProgressReport = async (req, res) => {
   try {
     // Fetch completed workouts for the user
     const completedWorkout = await Workout.find({
       userId: req.user._id, 
       completedAt: { $exists: true }
     });
 
     // Send the completed workouts as a JSON response
     res.json(completedWorkout);
   } catch (error) {
     // Handle any errors during the database query
     console.error('Error fetching progress report:', error);
     res.status(500).json({ error: 'Server error. Please try again later.' });
   }
 };

 const scheduledWorkout = async (req, res) => {
   const { scheduledAt} = req.body
   try {
      const workout = await Workout.findOneAndUpdate( { _id: req.params.id }, {scheduledAt}, {new: true, runValidators: true})
      if(!workout) return res.status(404).json({success: false, message: 'Workout not found'})
      res.status(201).json({success: true, message: 'Wokout succesfully scheduled', workout})
   } catch (error) {
      res.status(500).json({success: false, message: 'error scheduling workout'})
   }
 }
 
 const getUpcomingWorkouts = async (req, res) => {
   try {
     // Fetch upcoming workouts for the user
     const workouts = await Workout.find({
       userId: req.params.id,
       completedAt: { $exists: false },
       scheduledAt: { $gte: new Date() } // Workouts in the future
     }).sort({ scheduledAt: 1 });
 
     // Send email reminders (await to ensure emails are sent before responding)
     await workoutEmail();
 
     // Respond with the upcoming workouts
     res.json({ success: true, workouts });
   } catch (error) {
     // Handle any errors that occur
     console.error('Error fetching upcoming workouts:', error);
     res.status(500).json({ success: false, message: 'Error fetching upcoming workouts', error });
   }
 };
 


module.exports = {getUpcomingWorkouts,scheduledWorkout,createWorkout, getProgressReport, logProcess, getWorkouts}