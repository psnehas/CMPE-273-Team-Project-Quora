import { combineReducers } from 'redux';

import { authentication } from './login.reducer';
import { signup } from './signup.reducer';
import { profile } from './profile.reducer';


const rootReducer = combineReducers({
  authentication,
  signup,
  profile
});

export default rootReducer;