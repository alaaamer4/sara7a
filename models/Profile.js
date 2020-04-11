const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Profile = mongoose.model("Profile", ProfileSchema);
function validateProfile(profile) {
  const schema = {
    status: Joi.string().required(),
    skills: Joi.string().required(),
    facebook: Joi.string(),
    youtube: Joi.string(),
    twitter: Joi.string(),
    linkedin: Joi.string(),
    instagram: Joi.string(),
    bio: Joi.string(),
    location: Joi.string(),
  };
  return Joi.validate(profile, schema);
}
exports.Profile = Profile;
exports.validateProfile = validateProfile;
