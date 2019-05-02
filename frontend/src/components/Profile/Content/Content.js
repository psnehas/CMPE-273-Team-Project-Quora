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
            <React.Fragment>
                <Route path='/profile/:uid/' exact component={ProfileContent} />
                <Route path='/profile/:uid/answers' component={AnswersContent} />
                <Route path='/profile/:uid/questions' component={QuestionsContent} />
                <Route path='/profile/:uid/followers' component={FollowersContent} />
                <Route path='/profile/:uid/following' component={FollowingContent} />
            </React.Fragment>

        )
    }
}

export default Content;