import { combineReducers } from "redux";
import alert from "./reducers/alert";
import auth from "./reducers/auth";
const rootReducer = combineReducers({
  alert,
  auth,
});
export default rootReducer;
