const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Split the "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied, No token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach the decoded token payload to the request
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token', error });
  }
};

module.exports = authMiddleware;
