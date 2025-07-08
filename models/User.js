require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
   username: {type: String, ref: 'User', required: true},
   password: {type: String, required : true},
   email: {type: String, required: true, unique: true}, 
   refreshToken: {type: String},
   resetToken: {type: String},
   resetTokenExpiry: {type: String}
}, {timestamps: true})


userSchema.pre('save', async (next) => {
   next()
})

const User = mongoose.model('User', userSchema)
module.exports = User