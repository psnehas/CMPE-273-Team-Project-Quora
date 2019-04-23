import { userConstants } from '../_constant';

function login_request(email) { return { type: userConstants.LOGIN_REQUEST, email} }
function login_success(email, role, user_id, first_name) { 
    return { type: userConstants.LOGIN_SUCCESS, email, user_id, first_name}; }
function login_failure(email, err) { return { type: userConstants.LOGIN_FAILURE, email, err } }
function logout() {
    return { type: userConstants.LOGOUT};
}

function signup_request(email) { return { type: userConstants.SIGNUP_REQUEST, email} }
function signup_success(email, role, user_id,first_name) { 
    return { type: userConstants.SIGNUP_SUCCESS, email, user_id, first_name}; }
function signup_failure(email, err) { return { type: userConstants.SIGNUP_FAILURE, email, err } }

export const userActions = {
    login_request,
    login_success,
    login_failure,
    logout, 
    signup_request,
    signup_success,
    signup_failure, 
};