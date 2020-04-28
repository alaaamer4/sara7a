import React, { Fragment, useEffect } from "react";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/layout/Landing";
import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./store/actions/auth";
import store from "./store/store";
import Alerts from "./components/layout/Alerts";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = (props) => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return props.auth.isLoading === false ? (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alerts />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  ) : (
    <div className="container">
      <Loader
        type="Circles"
        color="#00BFFF"
        height={400}
        width={300}
        className="text-center"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(App);
