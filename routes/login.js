const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    const {email,password}=req.body
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json("Invalid Credentials");
  const passwordIsValid = await bcrypt.compare(
    password,
    user.password
  );
  try {
    if (passwordIsValid) {
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
    }else{
        return res.status(400).json('Invalid Credentials')
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
