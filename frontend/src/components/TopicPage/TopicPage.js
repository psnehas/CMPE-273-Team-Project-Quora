import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './TopicPage.css';
//import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { david_test_apis, backend_host } from '../../config';
import renderHTML from 'react-render-html';
import Moment from 'react-moment';
import { BadgeGroup } from '../QuestionPage/QuestionPage'
//import { throws } from 'assert';

var html_truncate = require('html-truncate');

class TopicPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            user_name: this.props.authentication.first_name + ' ' + this.props.authentication.last_name,
            topic: this.props.match.params.topic,
            token: cookie.load('JWT')
        }
    }

    componentDidMount() {
        axios.get(backend_host + '/topics/' + this.state.topic + '/questions', {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
            //           params: {
            //               topic: this.state.topic,
            //               topAnswer: true,
            //               depth: 1,
            //           }
        }).then(response => {
            //console.log(response.data);
            this.setState({
                questions: response.data.questions,
                followers: response.data.followers,
                topic: response.data.label,
                followed: response.data.followed


            })

        }).catch(error => {
            console.log(error);
        })
    }

    render() {

        let main_panel = null;
        let redirectVar = null;
        if (this.props.authentication.loggedIn !== true) {
            redirectVar = <Redirect to="/login" />
        }

        if (this.state.questions.length !== 0) {
            main_panel = this.state.questions.map((q, idx) => {
                let answer = null;

                if ('answers' in q && q.answers.length !== 0) {
                    
                    let creator = (<ul className="list-unstyled">
                    <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'/profile/' +  q.answers[0].owner._id}>{q.answers[0].owner.user_info.first_name} {q.answers[0].owner.user_info.last_name},</Link><span style={{ marginLeft: 10 }}>{q.answers[0].owner.user_info.profileCredential}</span></li>
                    <li><small className="text-muted">Answered <Moment fromNow>{q.answers[0].time}</Moment></small></li>
                </ul>)

                if (q.answers[0].anonymous === true) {
                    creator = (<ul className="list-unstyled">
                        <li style={{ fontSize: 14 }}>Anonymous User</li>
                        <li><small className="text-muted">Answered <Moment fromNow>{q.answers[0].time}</Moment></small></li>
                    </ul>)
                }
                    //console.log(html_truncate(q.answers[0].answerText, 3));
                    answer = (
                        <div>
                            {creator}
                            {/*
                            <ul className="list-unstyled">
                                <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'/profile/' + q.answers[0].owner._id}>{q.answers[0].owner.user_info.first_name} {q.answers[0].owner.user_info.last_name},</Link><span style={{ marginLeft: 10 }}>{q.answers[0].owner.user_info.profileCredential}</span></li>
                                <li><small className="text-muted">Answered <Moment fromNow>{q.answers[0].time}</Moment></small></li>
                            </ul>
                            */}
                            <p className="comment_truncate">
                                {renderHTML(html_truncate(q.answers[0].content, 150))}
                            </p>
                        </div>
                    )
                }
                else {
                    answer = <p>Be the first to answer this question! </p>
                }
                return (
                    <Card key={idx}>
                        <Card.Body >
                            <BadgeGroup data={q.topics} />
                            <Card.Title style={{ fontWeight: 'bold' }}>{q.content}</Card.Title>
                            <Card.Text >
                                {answer}
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
                {redirectVar}
                <Card>
                    <Card.Body style={{ "fontSize": 20, "color": '#666', 'fontWeight': 'bold' }}>
                        {this.state.topic}
                        <br />
                        <Button variant="link" onClick={this.handleFollow} disabled={this.state.followed}>
                            <span className="fa fa-plus-square"></span> {this.state.followed ? 'Followed' : 'Follow'}  ·  {this.state.followers}</Button>
                    </Card.Body>
                </Card>
                <br />
                {main_panel}
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({ authentication });
export default connect(mapStateToProps)(TopicPage);