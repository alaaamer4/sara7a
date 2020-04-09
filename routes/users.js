const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const grvatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../models/User");

//  load env variables
dotenv.config({ path: "../config/config.env" });

//@route POST api/users
//@Create new user
//@access public
router.post("/", async (req, res) => {
  try {
    // validate user input
    const result = validate(req.body);
    if (result.error) {
      return res.status(400).json({
        success: false,
        ERROR: result.error.details[0].message,
      });
    }
    // check if user already exists
    const { email, password, name } = req.body;
    let user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        success: false,
        ERROR: "user already  exists",
      });
    }
    // assign a gravatar to the user
    const avatar = grvatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    // create instence of a user
    user = new User({
      name,
      email,
      password,
      avatar,
    });
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
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
