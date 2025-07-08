const {body, validationResult } = require('express-validator')
const express = require('express')
const { login, register, refreshToken, resetPassword, forgetPassword } = require('../controllers/authControllers')
const authMiddleware = require('../authMiddlewares/authMiddleware')
const limit = require('../utils/limiter')
const  router = express.Router()


router.post('/register', [ body('email').isEmail().withMessage('Please provide a valid email'),
   body('password').isLength({min: 6}).withMessage('Password must be 6 character long')
], register)

router.post('/login',limit, login)

// refresh token  
router.post('/refresh-token',authMiddleware, refreshToken)


// Reset password routes
router.post('/reset-password', resetPassword)

router.post('/forget-password', forgetPassword)



module.exports = router