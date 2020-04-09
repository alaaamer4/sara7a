const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// creat model
const User = mongoose.model("User", userSchema);

// validation
function validateUsers(user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  };
  return Joi.validate(user, schema);
}
// repeated code needs modification
function validateLogin(user) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;
exports.validateLogin = validateLogin;
