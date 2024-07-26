const jwt = require('jsonwebtoken');


const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // No token, unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token, forbidden
    }

    req.user = user;
    console.log('Decoded user from token:', user); // Debugging line
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
