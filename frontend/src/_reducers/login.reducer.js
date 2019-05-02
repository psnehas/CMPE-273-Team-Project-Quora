import { userConstants } from '../_constant';

//let user = JSON.parse(localStorage.getItem('user'));
//const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = {}, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        email: action.email,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        email: action.email,
   //     role: action.role,
//        user_id: action.user_id,
        first_name: action.firstname,
        last_name: action.lastname
      }
    case userConstants.LOGIN_FAILURE:
      return {
        loginFailed: true,
        email: action.email,
        err: action.err,
      };
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}
