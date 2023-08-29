const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = require('../secret');

router.post("/signup", async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password,
  });
  user.save().then(
    (result) => {
      res.status(201).json({
        message: "User created!",
        result: result,
      });
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});

router.post("/login", async (req, res, next) => {
  let userFound;
  User.findOne({ email: req.body.email })
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
          message: "Auth failed!",
        });
        return;
      }
      const token = jwt.sign(
        {
          email: userFound.email,
          id: userFound._id,
        },
        secret,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token,
        expiresIn: 3600
      });
    })
    .catch(() => {
      res.status(401).json({
        message: "Auth failed!",
      });
    });
});

module.exports = router;
