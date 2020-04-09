const auth = require("../middleware/auth");
const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const grvatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validateLogin } = require("../models/User");

//  load env variables
dotenv.config({ path: "../config/config.env" });

//@ access private
// @get a specific user info
// @ route   GET /api/auth/:id
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      ERROR: "server error",
    });
  }
});

//@route POST api/users
//@authenticate  user & get token
//@access public
router.post("/", async (req, res) => {
  try {
    // validate user input
    const result = validateLogin(req.body);
    if (result.error) {
      return res.status(400).json({
        success: false,
        ERROR: result.error.details[0].message,
      });
    }
    // check if user already exists
    const { email, password } = req.body;
    let user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        ERROR: "invalid information",
      });
    }
    // match user password
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({
        success: false,
        ERROR: "invalid information",
      });
    }
    // response jwt
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
        });
      }
    );

    // catching any error
  } catch (error) {
    res.status(400).json({
      success: false,
      ERROR: error.message,
    });
  }
});

module.exports = router;
