const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useUnifiedTopology: true, 
         useNewUrlParser: true
      });
      console.log('MongoDB Connected');
   } catch (error) {
      console.log('MongoDB disconnected', error);
      process.exit(1); // Exiting with error code
   }
};

module.exports = connectDB;
