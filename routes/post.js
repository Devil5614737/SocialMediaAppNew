const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.post("/create-post", auth, async (req, res) => {
  const { caption, image } = req.body;
  const newPost = new Post({
    caption,
    image,
    postedBy: req.user._id,
  });
  try {
    let post = await Post.create(newPost);
    post = await post.populate("postedBy", "-password");
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/my-posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id })
      .populate("comments.postedBy", "-password")
      .populate("postedBy", "-password")
      .populate("likes", "-password");
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error);
  }
});
router.get("/all-posts", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("comments.postedBy", "-password")
      .populate("postedBy", "-password")
      .populate("likes", "-password")
      .sort({ $natural: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error);
  }
});

router.get("/other-user-posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.query.userId })
      .populate("comments.postedBy", "-password")
      .populate("postedBy", "-password")
      .populate("likes", "-password");
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(200).json(error);
  }
});

router.put("/comment", auth, async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    {
      $push: {
        comments: comment,
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
router.put("/like", auth, async (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    {
      $push: {
        likes: req.user._id,
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
router.put("/unlike", auth, async (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    {
      $pull: {
        likes: req.user._id,
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

router.post("/remove-post", auth, async (req, res) => {
  Post.findByIdAndDelete({ _id: req.body.postId }).exec((err, result) => {
    if (err) {
      console.log(err);
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.post("/share", auth, async (req, res) => {
  try {

    Post.findByIdAndUpdate(req.body.postId,{
      $push:{
        shares:req.user._id
      }
    }).exec(async(err,result)=>{
      if(err) console.log(err)
      else{ 
        const post = await Post.findById({ _id: req.body.postId });

        const share = new Post({
          caption: post?.caption,
          image: post?.image,
          postedBy: req.user._id,
        });
    
        let sharedPost = await Post.create(share);
         sharedPost= await sharedPost.populate("postedBy", "-password");
        return res.status(200).json(sharedPost);
      }
    })
  
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
