const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your-secret'; // Use env vars in production

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET); // VERIFICATION!
    req.id = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
