const jwt = require('jsonwebtoken');
const secret = require('../secret');

const checkAuth = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, secret);
      next();
    } catch {
      res.status(401).end();
    }
}

module.exports = checkAuth;
