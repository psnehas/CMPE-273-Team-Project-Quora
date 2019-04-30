import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
//import './Home.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import { Container, Col, Card, Button, Row } from 'react-bootstrap';

class TopicPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            user_name: 'Yu Zhao'
        }
    }

    componentDidMount() {

        const questions = [
            {
                "questionText": "questionText1",
                "_id": 123,
                "top_answer":
                {
                    answerText: 'AnswerText1',
                    createdOn: "2000-01-23T04:56:07.000+00:00",
                    createdBy: "createdBy1"
                }
            },
            {
                "questionText": "questionText2",
                "top_answer":
                {
                    answerText: 'AnswerText2',
                    createdOn: "2000-01-23T04:56:07.000+00:00",
                    createdBy: "createdBy2"
                }
            }
        ];
        this.setState({

            questions: questions
        });
    }

    render() {

        let main_panel = null;
        if (this.state.questions.length !== 0) {
            main_panel = this.state.questions.map(q => {
                return (
                    <Card>
                        <Card.Body>
                            <Card.Title>{q.questionText}</Card.Title>
                            <Card.Text
                                style={{
                                    "overflow": "hidden",
                                    "text-overflow": "ellipsis",
                                    "display": "-webkit-box",
                                    "-webkit-line-clamp": 3
                                }}>
                                {q.top_answer.answerText}
                            </Card.Text>
                            <Card.Link as={NavLink} to={'/questions/' + q._id}>more</Card.Link>
                        </Card.Body>
                    </Card>

                )
            });
        }
        else {
            main_panel = (
                <div>
                    What is your question?
                </div>
            )
        }


        return (

            <div>

                <Col>

                    {main_panel}
                </Col>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({ authentication });
export default connect(mapStateToProps)(TopicPage);