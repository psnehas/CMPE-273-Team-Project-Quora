import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import style from '../../Profile.module.css'

class AnswersContent extends Component {
    render() {
        return (
            <React.Fragment>
                <h3 className={style.contentTitle}>
                    Answers
                </h3>
                <ListGroup>
                    <h5>Created Answers</h5>
                    {this.props.profile.created_answers.map((a, index) => {
                        return (
                            <ListGroup.Item key={"created" + a._id}>
                                <Link to={`/questions/${a.question_id._id}`}>Answer to: {a.question_id.content}</Link>
                            </ListGroup.Item>
                        )
                    })}
                    <br />
                    <h5>Bookmarked Answers</h5>
                    {this.props.profile.bookmarked_answers.map((a, index) => {
                        return (
                            <ListGroup.Item key={"bookmarked" + a._id}>
                                <Link to={`/questions/${a.question_id._id}`}>Answer to: {a.question_id.content}</Link>
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
export default connect(mapStateToProps)(AnswersContent);