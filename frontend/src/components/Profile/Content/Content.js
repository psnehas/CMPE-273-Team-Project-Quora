import React, { Component } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";

import ProfileContent from './ProfileContent/ProfileContent';
import AnswersContent from './AnswersContent/AnswersContent';
import QuestionsContent from './QuestionsContent/QuestionsContent';
import FollowersContent from './FollowersContent/FollowersContent';
import FollowingContent from './FollowingContent/FollowingContent';

class Content extends Component {

    render() {
        return (
            // props => <ProfileContent {...props} />
            <React.Fragment>
                <Route path='/profile/:uid/' exact component={ProfileContent} />
                <Route path='/profile/:uid/answers' exact component={AnswersContent} />
                <Route path='/profile/:uid/questions' exact component={QuestionsContent} />
                <Route path='/profile/:uid/followers' exact component={FollowersContent} />
                <Route path='/profile/:uid/following' exact component={FollowingContent} />
            </React.Fragment>

        )
    }
}

export default Content;