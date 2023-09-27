const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    const { email, id } = decodeToken;
    req.user = { email, id };
    next();
  } catch {
    res.status(401).json({message: 'You\'re not authenticated!'});
  }
};

module.exports = checkAuth;
