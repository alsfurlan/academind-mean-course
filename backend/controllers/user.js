
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const user = new UserModel({
    email: req.body.email,
    password,
  });
  user.save().then(
    (result) => {
      res.status(201).json({
        message: 'User created!',
        result: result,
      });
    },
    (error) => {
      res.status(500).json({
        message: 'Invalid authentication credentials!',
      });
    }
  );
};

exports.login = (req, res, next) => {
  let userFound;
  UserModel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return;
      }
      userFound = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        res.status(401).json({
          message: 'Invalid authentication credentials!',
        });
        return;
      }
      const token = jwt.sign(
        {
          email: userFound.email,
          id: userFound._id,
        },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token,
        userId: userFound._id,
        expiresIn: 3600,
      });
    })
    .catch(() => {
      res.status(401).json({
        message: 'Invalid authentication credentials!',
      });
    });
};
