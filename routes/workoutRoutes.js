const express = require('express')
const { createWorkout, logProcess, getProgressReport, getWorkouts, getUpcomingWorkouts } = require('../controllers/workoutControllers')
const authMiddleware = require('../authMiddlewares/authMiddleware')
const router = express.Router()
const {body, validationResult, param} = require('express-validator')



// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   next();
 };
// Create a new workout (requires authentication)
router.post('/create', authMiddleware, [body('exercises').isArray({min: 1}).withMessage("At least one exercise is required")],handleValidationErrors, createWorkout);
//get workouts
router.get('/:id', authMiddleware,getWorkouts)
// Log progress of a specific workout (requires authentication)
router.put('/:id/progress',authMiddleware,[param('id').isMongoId().withMessage('Invalid workout ID'), 
   body('exercise').notEmpty().withMessage('Exercise data is required')
],handleValidationErrors,  logProcess);

// Get progress report for the authenticated user
router.get('/progress-report', authMiddleware, getProgressReport);
router.post('/upcoming', getUpcomingWorkouts)

module.exports = router;