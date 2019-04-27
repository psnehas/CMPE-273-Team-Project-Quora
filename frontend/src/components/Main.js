import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Home from './Home/Home';
import navbar from './NavBar/Navbar';
import Profile from './Profile/Profile';


//Create a Main Component
class Main extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={navbar} />

                <Switch>
                    {/*Render Different Component based on Route*/}
                    <Route path="/login" component={Login} />
                    <Route path='/signup' component={SignUp} />

                    <Route path="/home" exact component={Home} />
                    <Route path="/profile" exact component={Profile} />

                </Switch>
            </div>
        )
    }
}
//Export The Main Component
export default Main;