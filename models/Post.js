const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Joi = require("joi");
const postSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = {
    text: Joi.string().required(),
    name: Joi.string(),
    avatar: Joi.string(),
    likes: Joi.array(),
    comments: Joi.array(),
  };
  return Joi.validate(post, schema);
}

exports.validatePost = validatePost;
exports.Post = Post;
