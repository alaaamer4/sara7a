import * as types from "../types";

const initialState = [];

const alert = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case types.SET_ALERT:
      return [...state, payload];
    case types.REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
};

export default alert;
