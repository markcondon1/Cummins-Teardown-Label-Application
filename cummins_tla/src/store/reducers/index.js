import { combineReducers } from 'redux';
import userReducer from "./user";

const rootReducer = combineReducers({
    user: userReducer,
    // Add more reducers if needed
});

export default rootReducer;