import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../../_actions';

import style from '../Profile.module.css';

class Sidebar extends Component {

    render(){
        console.log("Profile Sidebar uid", this.props.uid);
        return (
            <Nav className="flex-column" variant="pills">
                <h3 className={style.contentTitle}>
                    <div>
                        Feeds
                </div>
                </h3>
                <NavLink to={`/profile/${this.props.authentication.user_id}`} className="nav-link" exact>
                    Profile
            </NavLink>
                <NavLink to={`/profile/${this.props.authentication.user_id}/answers`} className="nav-link">
                    Answers
            </NavLink>
                <NavLink to={`/profile/${this.props.authentication.user_id}/questions`} className="nav-link">
                    Questions
            </NavLink>
                <NavLink to={`/profile/${this.props.authentication.user_id}/followers`} className="nav-link">
                    Followers
            </NavLink>
                <NavLink to={`/profile/${this.props.authentication.user_id}/following`} className="nav-link">
                    Following
            </NavLink>

            </Nav>
        )
    }

}


// reducer: profile 's output maps to this.props.profile
const mapStateToProps = ({ authentication }) => ({ authentication });
// apply above mapping to Login class
export default connect(mapStateToProps)(Sidebar);