import { userConstants } from '../_constant';

export function signup(state = {}, action) {
  switch (action.type) {
    case userConstants.SIGNUP_REQUEST:
      return {
        signingIn: true,
        email: action.email,
      };
    case userConstants.SIGNUP_SUCCESS:
      return {
        signedUp: true,
//       email: action.email,
//        role: action.role,
//        user_id: action.user_id,
//        first_name: action.first_name
      }
    case userConstants.SIGNUP_FAILURE:
      return {
        signUpFailed: true,
        email: action.email,
        err: action.err,
      };
    default:
      return state
  }
}