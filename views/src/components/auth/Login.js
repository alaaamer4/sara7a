import React, { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { password, email } = input;
  const handelChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(input);
  };
  return (
    <div>
      <section>
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign into Your Account
        </p>
        <form className="form" action="dashboard.html" onSubmit={handelSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={handelChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handelChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
