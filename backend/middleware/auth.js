// =====================================================
// AUTH MIDDLEWARE - Protect Admin Routes with JWT
// =====================================================
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Oggolaansho ma jirto. Token kuma jirto.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token khalad ah ama waa la xumi.' });
  }
};
