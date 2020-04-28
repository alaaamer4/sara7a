import React, { useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../../store/actions/alert";
import { register } from "../../store/actions/auth";
const Register = (props) => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, password, email, password2 } = input;

  const handelChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      props.setAlert("passwords do not matched", "danger");
    } else {
      props.register({ name, email, password });
    }
  };
  return (
    <section>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={handelSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            value={name}
            onChange={handelChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={handelChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handelChange}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={handelChange}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <a href="login.html">Sign In</a>
      </p>
    </section>
  );
};
const mapActionToProps = {
  setAlert,
  register,
};
export default connect(null, mapActionToProps)(Register);
