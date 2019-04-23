import { combineReducers } from 'redux';

import { authentication } from './login.reducer';
import {signup} from './signup.reducer';


const rootReducer = combineReducers({
  authentication,
  signup,
});

export default rootReducer;