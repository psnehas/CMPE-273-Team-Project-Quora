import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './Home.css';
//import { userActions } from '../../_actions';
import { connect } from 'react-redux';
//import Sidebar from '../Sidebar/Sidebar';
import {Card, Button} from 'react-bootstrap';
import AddModal from '../NavBar/Add_Q_Modal';
import axios from 'axios';
import {david_test_apis} from '../../config';
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
            token: cookie.load('JWT'),
            refresh: true
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
    componentDidUpdate() {
        this.componentDidMount();
    }

    componentDidMount() {
        axios.get(david_test_apis + '/userfeed', {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
            params: {
 //               topAnswer: true,
  //              depth: 1
            }
        }).then(response => {
 //           console.log(response);
            this.setState({
                user_feed: response.data,
                refresh: false
            })
            
        }).catch(error => {
            this.setState({
                refresh: false
            }, ()=>{console.log(this.state.refresh)})
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
            main_panel = this.state.user_feed.map((q, idx) => {
                let answer = null;
                if ('answers' in q) {
  //                  console.log(html_truncate(q.answers[0].answerText, 3));
                    answer = (
                        <div>
                            <ul className="list-unstyled">
                                <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'profile/' + q.answers[0].createdBy.user_id}>{q.answers[0].createdBy.name},</Link><span style={{ marginLeft: 10 }}>{q.answers[0].createdBy.crediential}</span></li>
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
                    <Card key = {idx}>
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
        let handleReload = () => this.setState({refresh: true},()=>{console.log(this.state.refresh)});

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
                    afteradd={this.afterAdd}

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
                                    <Card.Title style={{ "fontSize": 14, "color": 949494 }}>{'Hi, ' + this.state.user_name}</Card.Title>
                                    <Button variant="link" onClick={this.showModal} style={{ 'textDecoration': 'none' }} className="add_q_link">What is your question?</Button>
                                </Card.Body>
                            </Card>

                            <br />

                            <Card>
                                <Card.Header as="h6"><span className="fa fa-question"></span> Questions for You
                                <Button variant="link" onClick={handleReload} style={{ 'textDecoration': 'none' }} className="add_q_link"><span className="fa fa-refresh"></span></Button>
                                </Card.Header>
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