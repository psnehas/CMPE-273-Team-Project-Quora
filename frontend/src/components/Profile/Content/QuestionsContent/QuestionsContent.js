import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import style from '../../Profile.module.css'

class QuestionsContent extends Component {
    render() {
        return (
            <React.Fragment>
                <h3 className={style.contentTitle}>
                    Questions
                </h3>
                <ListGroup>
                    {this.props.profile.created_questions.map((q, index) => {
                        return (
                            <ListGroup.Item key={q._id}>
                                <Link to={`/questions/${q._id}`}>{q.content}</Link>
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
export default connect(mapStateToProps)(QuestionsContent);