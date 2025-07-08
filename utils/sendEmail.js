const nodemailer = require('nodemailer');




const sendEmail = async(user) => {

   try {
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         host: "smtp.gmail.com",
         port: 587,
         secure: false, // 
         auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS}
      })

      const mailOptions ={
         from: process.env.EMAIL_USER,
         to: user.email,
         subject: 'Password Reset Request',
          text: `secure: false, // 
                 ${process.env.FRONTEND_URL}/reset-password/${user.resetToken}`
        };
        const info = await transporter.sendMail(mailOptions); // Use async/await
        console.log('Email sent: ' + info.response); // Optional: log info
        return { success: true, message: 'Reset Link sent to your email' };
   } catch (error) {
      console.error('Error sending email', error)
   }
   
}

module.exports = sendEmail
