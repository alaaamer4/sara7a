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

//@ PUT /api/post/like/:id
//@ like a post
//@ access private
router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  //check if the user already liked the post
  if (
    post.likes.map((like) => like.user.toString() === req.user.id).length > 0
  ) {
    return res.status(401).json({
      success: false,
      ERROR: "user already liked the post",
    });
  }
  post.likes.push({ user: req.user.id });
  await post.save();
  res.status(200).json({
    success: true,
    likes: post.likes,
    post: post,
  });
});
//@ PUT /api/post/unlike/:id
//@ unlike a post
//@ access private
router.put("/unlike/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  //check if the user already liked the post
  if (
    post.likes.map((like) => like.user.toString() === req.user.id).length === 0
  ) {
    return res.status(401).json({
      success: false,
      ERROR: "you can't unlike what you didn't like :') ",
    });
  }
  const removeIndex = post.likes
    .map((like) => like.user.toString())
    .indexOf(req.user.id);
  post.likes.splice(removeIndex, 1);
  await post.save();
  res.status(200).json({
    success: true,
    likes: post.likes,
    post: post,
  });
});
//@ POST /api/posts/comments/:id
//@ comment on a post
//@ access private
router.post("/comments/:id", auth, async (req, res) => {
  try {
    const result = validatePost(req.body);
    if (result.error) {
      return res.status(400).json({
        success: false,
        ERROR: result.error.details[0].message,
      });
    }
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id).select("-password");
    const comment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };
    post.comments.push(comment);
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

//@ DELETE /api/posts/comments/:id/:comment_id
//@ delete a comment
//@ access private
router.delete("/comments/:id/:comment_id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  // get comment by id
  const comment = post.comments.find(
    (comment) => comment.id === req.params.comment_id
  );
  if (!comment) {
    return res.status(404).json({
      success: false,
      ERROR: "comment not found",
    });
  }
  //check user
  if (comment.user.toString() !== req.user.id) {
    return res.status(400).json({
      success: false,
      ERROR: "user is no authorized",
    });
  }
  removeIndex = post.comments
    .map((comment) => comment.user.toString())
    .indexOf(req.user.id);
  post.comments.splice(removeIndex, 1);
  await post.save();
  res.status(200).json({
    success: true,
    message: "user was deleted successfully",
    data: post,
  });
});
module.exports = router;
