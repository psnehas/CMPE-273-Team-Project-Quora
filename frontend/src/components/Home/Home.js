import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './Home.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import { Container, Col, Card, Button, Row } from 'react-bootstrap';
import AddModal from '../NavBar/Add_Q_Modal';
import axios from 'axios';
import { msgstore_apis, david_test_apis, user_tracking_apis } from '../../config';
import renderHTML from 'react-render-html';
import Moment from 'react-moment';
import { BadgeGroup } from '../QuestionPage/QuestionPage'

var html_truncate = require('html-truncate');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_feed: [],
            show_add: false,
            user_name: this.props.authentication.first_name + ' ' + this.props.authentication.last_name,
            token: cookie.load('JWT')
        }
        this.showModal = this.showModal.bind(this);
    }

    showModal = (e) => {
        e.preventDefault();
        this.setState({
            show_add: true,
        })
    }

    afterAdd = () => {
        this.setState({
            show_add: false
        })
    }

    selectTopics = (e) => {
        e.preventDefault();
        this.setState({
            show_topics: true
        })
    }
    componentDidMount() {
        axios.get(david_test_apis + '/questions', {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            },
            params: {
                topAnswer: true,
                depth: 1
            }
        }).then(response => {
            console.log(response);
            this.setState({
                user_feed: response.data
            })
            
        }).catch(error => {
            console.log(error);
        })
/*
        const questions = [
            {
                "questionText": "Just need  a post to test Frontend",
                "_id": '5cc78a2f71b80f00016d4285',
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
//            sidebar_links: sidebar_links,
            questions: questions
        });
        */
    }

    render() {

        let main_panel = null;

        if (this.state.user_feed.length !== 0) {
            main_panel = this.state.user_feed.map(q => {
                let answer = null;
                if ('answers' in q) {
                    console.log(html_truncate(q.answers[0].answerText, 3));
                    answer = (
                        <div>
                            <ul className="list-unstyled">
                                <li>{q.answers[0].displayName} </li>
                                <li><small className="text-muted">Answered <Moment fromNow>{q.answers[0].createdOn}</Moment></small></li>
                            </ul>
                            <p className="comment_truncate">
                                {renderHTML(html_truncate(q.answers[0].answerText, 150))}
                            </p>
                        </div>
                    )
                }
                else {
                    answer = <p>Be the first to answer this question! </p>
                }
                return (
                    <Card>
                        <Card.Body >
                            <BadgeGroup data={q.topics} />
                            <Card.Title style={{ fontWeight: 'bold' }}>{q.questionText}</Card.Title>
                            <Card.Text >
                                {answer}
                            </Card.Text>
                            <Card.Link as={NavLink} to={'/questions/' + q._id}>more</Card.Link>
                        </Card.Body>
                    </Card>

                )
            });
        }

        /*
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
                            <Card.Link as={NavLink} to={'questions/' + q._id}>more</Card.Link>
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
        }*/

        let modal_Q_Close = () => this.setState({ show_add: false });
        let redirectVar = null;
        if (this.props.authentication.loggedIn !== true){
            redirectVar = <Redirect to="/login" />
        }
        return (

            <div>
            {redirectVar}
                <AddModal
                    show={this.state.show_add}
                    onHide={modal_Q_Close}
                    user_name={this.state.user_name}
                    after_add={this.after_add}

                />
                {/*}
                <Container>
                    <Row style={{ "margin-top": 50 }}>
                        <Col md='auto'>
                            <Sidebar links={this.state.sidebar_links} />
                            <Button style={{ 'text-decoration': 'none', "font-size": 14, "line-height": 10 }} variant="link" onClick={this.selectTopics}>Follow More</Button>
                        </Col>
                        <Col> */}
                            <Card>
                                <Card.Body>
                                    <Card.Title style={{ "font-size": 14, "color": 949494 }}>{'Hi, ' + this.state.user_name}</Card.Title>
                                    <Button variant="link" onClick={this.showModal} style={{ 'text-decoration': 'none' }} className="add_q_link">What is your question?</Button>
                                </Card.Body>
                            </Card>

                            <br />

                            <Card>
                                <Card.Header as="h6"><span className="fa fa-question"></span> Questions for You</Card.Header>
                            </Card>
                            {main_panel} {/* </Col>
                    </Row>
                </Container>*/}
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({ authentication });
export default connect(mapStateToProps)(Home);