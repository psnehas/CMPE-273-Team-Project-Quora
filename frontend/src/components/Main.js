import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Home from './Home/Home';
import QuestionPage from './QuestionPage/QuestionPage';
import SidebarLayout from './SidebarLayout/SidebarLayout';
import Navbar from './NavBar/Navbar'
import TopicPage from './TopicPage/TopicPage';


//Create a Main Component
class Main extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <Switch>
                    {/*Render Different Component based on Route*/}
                    <SidebarLayout exact path="/" component={Home} />

                    <SidebarLayout path="/topics/:topic" component={TopicPage}/>

                    <Route path="/login" component={Login} />
                    <Route path='/signup' component={SignUp} />

                    <Route path="/questions/:questionId" component={QuestionPage} />

                </Switch>
            </div>
        )
    }
}
//Export The Main Component
export default Main;