const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

const register = async (req, res) => {
  const { email, username, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    
    user = new User({ email, password: hashPassword, username });
    await user.save(); // Ensure the user is saved to the database

    res.status(201).json({ success: true, message: 'User created successfully', userId: user._id });
  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Error creating user', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, success: true, message: 'Login successfully' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login unsuccessfully', error });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'Access Denied, No token found' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId); // Changed from decoded.id to decoded.userId
    
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'No user found with this token, access denied' });
    }
    
    const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (error) {
    console.error('Error during token refresh:', error); // Log the error for debugging
    res.status(403).json({ success: false, message: 'Access denied, invalid token' });
  }
};

const forgetPassword = async (req, res) => {
   const {email} = req.body
   try {
      const user = await User.findOne({email})
      if(!user){
         return res.status(404).json({message: 'User not found'})
      }
      const resetToken = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'})
      user.resetToken = resetToken
      user.resetTokenExpiry = Date.now() + 15*60*1000
      await user.save()
      await sendEmail(user)
      res.json({success: true, message: 'Reset email sent'})
   } catch (error) {
      res.status(500).json({success: false, message: 'error resetting token', error})
   }
}


const resetPassword = async (req, res) => {
  const {token, newPassword} = req.body
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findById(decoded.id)

    if(!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()){
      return res.status(403).json({message: 'Invalid token or expired token'})
    }

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()
    res.json({message: 'Password has been reset'})
  } catch (error) {
    res.status(403).json({success: false, message: 'Invalid token'})
    
  }
}

module.exports = { resetPassword, forgetPassword,login, register, refreshToken };
