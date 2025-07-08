const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Workout = require('../models/Workout');

const workoutEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Set to false for TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Schedule the cron job to run every minute (adjust timing as needed)
    cron.schedule(`* * * * *`, async () => {
      try {
        // Find workouts scheduled in the next 15 minutes
        const upcomingWorkouts = await Workout.find({
          scheduledAt: {
            $gte: new Date(),
            $lte: new Date(new Date().getTime() + 15 * 60 * 1000) // Next 15 minutes
          },
          completedAt: { $exists: false }
        }).populate('userId');

        // Loop through upcoming workouts and send reminders
        for (const workout of upcomingWorkouts) {
          const user = workout.userId;

          // Prepare email options
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Upcoming workout reminder',
            text: `Hi ${user.username}, don't forget your workout: ${workout.exercises.map(ex => ex.name).join(', ')} scheduled at ${workout.scheduledAt}.`
          };

          // Send email
          const info = await transporter.sendMail(mailOptions);
          console.log('Workout email notification sent: ' + info.response);
        }

        console.log('All workout reminders sent');
      } catch (error) {
        console.error('Error sending workout email:', error.message);
      }
    });
  } catch (error) {
    console.error('Error setting up transporter:', error);
  }
};

module.exports = workoutEmail;
