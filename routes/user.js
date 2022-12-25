const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/logged-user", auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.user._id });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.put("/add-friend", auth, async (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: { friends: req.user._id },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(
          req.user._id,
          {
            $push: { friends: req.body.userId },
          },
          { new: true }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});
router.put("/remove-friend", auth, async (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: { friends: req.user._id },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { friends: req.body.userId },
          },
          { new: true }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/other-users", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).find({
      friends: { $ne: req.user._id },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
  // if(!users?.friends?.includes(req.user._id)){
  //     console.log(users)
  // }
});
router.get("/friends", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).find({
      friends: { $eq: req.user._id },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
  // if(!users?.friends?.includes(req.user._id)){
  //     console.log(users)
  // }
});





router.get("/other-user-profile", auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.query.userId });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.put("/edit-profile", auth, async (req, res) => {
  let user;
  const { fullname, profession, coverPic, pic } = req.body;

   user=await User.find({_id:req.user._id});
  
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        fullname,
        profession,
        coverPic:coverPic===""?user?.coverPic:coverPic,
        pic:pic===""?user?.pic:pic,
      },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});


router.get('/search-users',auth,async(req,res)=>{
  const keyword = req.query.search
  ? {
      $or: [
        { fullname: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
  : {};

const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
return res.status(200).json(users);
})


module.exports = router;
