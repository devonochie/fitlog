const rateLimit = require('express-rate-limit')


const limit = rateLimit({
   windowMs: 15*60*1000,
   max: 5,
   message: 'Too many login attempts. Please try again after 10min'

})


module.exports = limit

