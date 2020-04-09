const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// lead env var
dotenv.config({ path: "../config/config.env" });

module.exports = function (req, res, next) {
  // get token from the header
  const token = req.header("x-auth-token");
  //check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      ERROR: "no token, authorization denied ",
    });
  }
  //verify the token
  try {
    const decode = jwt.verify(token, process.env.jwtSecret);
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      ERROR: "token is not valid",
    });
  }
};
