const express = require("express");
const router = express.Router();
const { Post, validatePost } = require("../models/Post");
const { User } = require("../models/User");
const auth = require("../middleware/auth");

//@ GET /api/post
//@ get all posts
//@ access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(404).json({
        success: false,
        ERROR: " no posts were found ",
      });
    }
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
});

//@ GET /api/post/:id
//@ get post by id
//@ access private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).sort({ date: -1 });
    if (!post) {
      return res.status(404).json({
        success: false,
        ERROR: " no posts were found ",
      });
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
});

//@ DELETE /api/post/:id
//@ delete post by id
//@ access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        ERROR: " no posts were found ",
      });
    }
    res.status(200).json({
      success: true,
      data: "post was deleted successfully ",
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
});
//@ POST /api/post
//@ create a post
//@ access private
router.post("/", auth, async (req, res) => {
  try {
    const result = validatePost(req.body);
    if (result.error) {
      return res.status(400).json({
        success: false,
        ERROR: result.error.details[0].message,
      });
    }
    const user = await User.findById(req.user.id).select("-password");
    const post = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });
    await post.save();
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: "server error" });
    console.log(error);
  }
});

module.exports = router;
