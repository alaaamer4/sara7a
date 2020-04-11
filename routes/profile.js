const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Profile, validateProfile } = require("../models/Profile");
const { User } = require("../models/User");

//@ GET /api/profile/user
//@ get current user profile
//@ access private
router.get("/user", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name ", "avatar"]);
    if (!profile) {
      return res
        .status(400)
        .json({ success: false, ERROR: "no profile for this user" });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, ERROR: error.message });
  }
});

//@ POST /api/profile
//@ create and update profile
//@ access private
router.post("/", auth, async (req, res) => {
  try {
    const result = validateProfile(req.body);
    if (result.error) {
      return res.status(400).json({
        success: false,
        ERROR: result.error.details[0].message,
      });
    }
    const {
      location,
      status,
      bio,
      skills,
      facebook,
      social,
      twitter,
      youtube,
      instagram,
      linkedin,
    } = req.body;
    // create profile fields object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    // create social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    // manage the profile
    let profile = await Profile.findOne({ user: req.user.id });
    // if there's a profile then we want to update it
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: profile,
      });
    }
    // if there's no profile then we want to create it
    profile = new Profile(profileFields);
    await profile.save();
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

//@ GET /api/profile
//@ get all profiles
//@ access public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.status(200).json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, ERROR: error.message });
  }
});
//@ GET /api/profile/user/:user_id
//@ get single user profile by user id
//@ access public
router.get("/users/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({
        success: false,
        ERROR: "profile not found",
      });
    }
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({ success: false, ERROR: "profile not found" });
  }
});

//@ DELETE api/profile
//@ desc    delete profile , user
//@ access  private
router.delete("/", auth, async (req, res) => {
  try {
    // delete the profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // delete the user
    await User.findOneAndRemove({ _id: req.user.id });
    res.status(200).json({
      success: true,
      msg: "user was deleted successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      ERROR: `server error ${error.message}`,
    });
  }
});
module.exports = router;
