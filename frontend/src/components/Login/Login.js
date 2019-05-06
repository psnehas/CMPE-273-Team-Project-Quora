import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import {backend_host,  user_auth_apis} from '../../config';
//import Cookies from 'universal-cookie';

//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email: "",
            password: "",
            submitted: false,
        }
        //Bind the handlers to this class
        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        //this.handleClick = this.handleClick.bind(this);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
 //       console.log("run login");
        //prevent page from refresh
        e.preventDefault();

        const data = {
            email: this.state.email,
            password: this.state.password
        }
        const { email } = this.state;

        // reset by logout
        this.props.dispatch(userActions.logout());
        this.props.dispatch(userActions.login_request(email));

        this.setState({ submitted: true });

        if (data.email && data.password) {
            //set the with credentials to true
 //           axios.defaults.withCredentials = true;
//			axios.defaults.crossDomain = true;
//            console.log("axios.defaults.crossDomain = true");
            //make a post request with the user data
            
            axios.post(backend_host +'/signin', data)
                .then(response => {
//                    console.log(response);
                    //console.log("Status Code : ", response.status);
                    //console.log("role:", response.data);
                    if (response.status === 200 /*&& response.data.auth === true*/) {
//						const cookies = new Cookies();
						cookie.save('JWT', response.data.token, { path: '/' });
						//console.log(cookies.get('JWT'));
                        this.props.dispatch(userActions.login_success(response.data.user_id,response.data.first_name, response.data.last_name));
                    } /*else {
                        this.props.dispatch(userActions.login_failure(email, "HTTP CODE != 200"));
                    }*/

                }).catch(err => {
                    this.props.dispatch(userActions.login_failure(email, err));
                    console.log(err);
                });
        }
    }
    /*
        handleClick = (e) => {
            e.preventDefault();
            this.setState({ to_SignUp: true });
        }
    */

    render() {
        const { authentication } = this.props;
        const { email, password, submitted } = this.state;

        //redirect based on successful login
        let redirectVar = null;
        //console.log(authentication);

        if (authentication.loggedIn === true) {
            redirectVar = <Redirect to="/" />;
        }


        let res_msg = null;
        if (authentication.loginFailed === true) {
            res_msg = (<p style={{color: 'red'}}>Invalid Password or Email!</p>);
        }

        return (
            <div>
                {redirectVar}
                <div className="container">

                    <div className="login-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2>Login</h2>
                                <p>Please enter your email and password</p>
                                {res_msg}
                            </div>

                            <div className={"form-group" + (submitted && !email ? 'has-error' : '')}>
                                <input onChange={this.handleChange} type="email" className="form-control" name="email" placeholder="Email Address" />
                                {submitted && !email &&
                                    <div className="help-block">Email is required</div>
                                }

                            </div>
                            <div className={"form-group" + (submitted && !password ? 'has-error' : '')}>
                                <input onChange={this.handleChange} type="password" className="form-control" name="password" placeholder="Password" />
                                {submitted && !password &&
                                    <div className="help-block">Password is required</div>
                                }
                            </div>
                            <button onClick={this.submitLogin} className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// reducer: authentication 's output maps to this.props.authentication
const mapStateToProps = ({ authentication }) => ({ authentication });
// apply above mapping to Login class
export default connect(mapStateToProps)(Login);
