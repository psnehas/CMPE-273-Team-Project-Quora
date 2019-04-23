import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import backend_host from '../../config';
//import Cookies from 'universal-cookie';

//Define a Login Component
class SignUp extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            first_name: "",
            last_name: "",
//            role: "",
            email: "",
            password: "",
            submitted: false,
            //            success: false
        }
        //Bind the handlers to this class
        this.handleChange = this.handleChange.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    //submit Login handler to send a request to the node backend
    submitSignUp = (e) => {
        e.preventDefault();
        const data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
//            role: this.state.role,
            password: this.state.password,
            email: this.state.email
        }

        console.log('Fire submit button!');

        const { email } = this.state;

        // reset by logout
        this.props.dispatch(userActions.signup_request(email));
        this.setState({ submitted: true });

        if (data.first_name && data.last_name && data.password && data.email) {

        //set the with credentials to true
 //       axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backend_host+'/signup', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200 && response.data.auth === true) {
                    //cookie.save('userId', response.data.user_id, { path: '/', expires: "", maxAge: 1000, httpOnly: false });
                    //cookie.save('role', response.data.role, { path: '/', expires: "", maxAge: 1000, httpOnly: false });
 //                   const cookies = new Cookies();
 //                   cookie.save('JWT', response.data.token, { path: '/' });
                    this.props.dispatch(userActions.login_success(email, response.data.role, response.data.user_id));
                } else {
                    this.props.dispatch(userActions.signup_failure(email, "HTTP CODE != 200"));
                }
            }).catch(err => {
                this.props.dispatch(userActions.signup_failure(email, err));
//                console.log(error.body.message)
            });
        }  
    }

    render() {
        //redirect based on successful login

        const { signup } = this.props;
        const { authentication } = this.props;
        const { first_name, last_name, email, password, submitted } = this.state;

        let redirectVar = null;
//        console.log(signup);
        if (authentication.loggedIn === true) {
            redirectVar = <Redirect to="/Home" />
        }

        return (
            <div>
                {redirectVar}
                <div className="container">

                    <div className="login-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2>Sign Up</h2>
                                <p>Please enter your name, email and password</p>
                            </div>
                            <div className={"form-group" + (submitted && !first_name ? 'has-error' : '')}>
                                <input onChange={this.handleChange} type="text" class="form-control" name="first_name" placeholder="First Name" required />
                                {submitted && !first_name &&
                                    <div className="help-block">First Name is required</div>
                                }
                            </div>
                            <div className={"form-group" + (submitted && !last_name ? 'has-error' : '')}>
                                <input onChange={this.handleChange} type="text" class="form-control" name="last_name" placeholder="Last Name" required></input>
                                {submitted && !last_name &&
                                    <div className="help-block">Last Name is required</div>
                                }
                            </div>
                            <div className={"form-group" + (submitted && !email ? 'has-error' : '')}>
                                <input onChange={this.handleChange} type="email" class="form-control" name="email" placeholder="Email Address" required></input>
                                {submitted && !email &&
                                    <div className="help-block">Email is required</div>
                                }
                            </div>
                            <div className={"form-group" + (submitted && !password ? 'password' : '')}>
                                <input onChange={this.handleChange} type="password" class="form-control" name="password" placeholder="Password" required />
                                {submitted && !password &&
                                    <div className="help-block">Password is required</div>
                                }
                            </div>
                            <button onClick={this.submitSignUp} class="btn btn-primary">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// reducer: authentication 's output maps to this.props.authentication
const mapStateToProps = ({ signup,  authentication }) => ({ signup, authentication });
// apply above mapping to Login class
export default connect(mapStateToProps)(SignUp);
