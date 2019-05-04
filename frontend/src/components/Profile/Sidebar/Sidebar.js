import React from 'react';
import { Nav } from 'react-bootstrap';
import { withRouter, NavLink } from 'react-router-dom';

import style from '../Profile.module.css';

const Sidebar = (props) => {
    console.log("Profile Sidebar uid", props.uid);
    return (
        <Nav className="flex-column" variant="pills">
            <h3 className={style.contentTitle}>
                <div>
                    Feeds
                </div>
            </h3>
            <NavLink to={`/profile/${props.uid}`} className="nav-link" exact>
                Profile
            </NavLink>
            <NavLink to={`/profile/${props.uid}/answers`} className="nav-link">
                Answers
            </NavLink>
            <NavLink to={`/profile/${props.uid}/questions`} className="nav-link">
                Questions
            </NavLink>
            <NavLink to={`/profile/${props.uid}/followers`} className="nav-link">
                Followers
            </NavLink>
            <NavLink to={`/profile/${props.uid}/following`} className="nav-link">
                Following
            </NavLink>

        </Nav>
    )
}

export default withRouter(Sidebar);