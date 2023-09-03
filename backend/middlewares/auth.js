const jwt = require("jsonwebtoken");
const secret = require("../secret");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, secret);
    const { email, id } = decodeToken;
    req.user = { email, id };
    next();
  } catch {
    res.status(401).end();
  }
};

module.exports = checkAuth;
