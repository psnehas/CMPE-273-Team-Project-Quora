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
                <Route path='/profile/:uid/' exact render={() => <ProfileContent {...this.props} />} />
                <Route path='/profile/:uid/answers' render={() => <AnswersContent {...this.props} />} />
                <Route path='/profile/:uid/questions' render={() => <QuestionsContent {...this.props} />} />
                <Route path='/profile/:uid/followers' render={() => <FollowersContent {...this.props} />} />
                <Route path='/profile/:uid/following' render={() => <FollowingContent {...this.props} />} />
            </React.Fragment>

        )
    }
}

export default Content;