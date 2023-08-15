const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

router.post("/signup", async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password,
  });
  try {
    const result = await user.save();
    res.status(201).json({
      message: "User created!",
      result,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/login", (req, res, next) => {});

module.exports = router;
