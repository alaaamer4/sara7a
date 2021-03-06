import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
} from "../types";

// loading the user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    dispatch({ type: USER_LOADED, payload: res.data.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// handel registering the user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users", body, config);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data.token });
  } catch (err) {
    const error = err.response.data.ERROR;
    if (error) {
      dispatch(setAlert(error, "danger"));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};
