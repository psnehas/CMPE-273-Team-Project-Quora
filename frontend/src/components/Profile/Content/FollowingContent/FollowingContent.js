import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { userActions } from '../../../../_actions';
import axios from 'axios';
import cookie from 'react-cookies';
import { backend_host } from '../../../../config';

import style from '../../Profile.module.css'

class FollowingContent extends Component {

    onClickHandler = (id) => {
        // this.dispatch(userActions.)
        axios.get(`${backend_host}/profile/${id}`, {
            headers: {
                'Authorization': `Bearer ${cookie.load('JWT')}`
            }
        }).then(res => {
            if (res.status === 200) {
                res.data.user_info.avatar = `${backend_host}/user_avatar/${id}`
                this.props.dispatch(userActions.profile_update(res.data))
            }
        })
    }

    render() {

        console.log("following", this.props.profile)
        return (
            <React.Fragment>
                <h3 className={style.contentTitle}>
                    Followings
                </h3>
                <ListGroup>
                    {this.props.profile.followed_people.map((p, index) => {
                        return (
                            <ListGroup.Item key={p._id} onClick={() => this.onClickHandler(p._id)}>
                                <Link to={`/profile/${p._id}`}>{`${p.user_info.first_name} ${p.user_info.last_name}`}</Link>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </React.Fragment>
        )
    }
}

// reducer: profile 's output maps to this.props.profile
const mapStateToProps = ({ profile }) => ({ profile });
// apply above mapping to Login class
export default connect(mapStateToProps)(FollowingContent);