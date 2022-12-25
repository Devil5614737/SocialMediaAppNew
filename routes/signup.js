const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken')

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  const newUser = new User({
    fullname,
    email,
    password,
  });

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return res.status(400).json("User Already Registered");

  try {
    const salt = await bcrypt.genSalt(12);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const user = await newUser.save();
    const token = jwt.sign(
      {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        pic: user.pic,
      },
      process.env.SECRET_KEY
    );

    return res.status(200).json(token);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
  }
});

module.exports = router;
