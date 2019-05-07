import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import style from '../../Profile.module.css'

class FollowingContent extends Component {
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
                            <ListGroup.Item key={p._id}>
                                <Link to={`/profile/${p._id}`}>{`${p.first_name} ${p.last_name}`}</Link>
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