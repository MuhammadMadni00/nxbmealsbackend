const jwt = require('jsonwebtoken');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
       console.log("invalid");
  }
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
