const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi=require('joi')

router.post("/login", async (req, res) => {
    const {email,password}=req.body

const schema=Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().required(),
})

const {error}=schema.validate(req.body)
if(error) return res.status(400).json(error.details[0].message);


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
