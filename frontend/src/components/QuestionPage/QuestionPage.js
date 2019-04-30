import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import './QuestionPage.css';
import { ListGroup, Container, Badge, ButtonToolbar, Button, Collapse, Card, Form, Col, Row } from 'react-bootstrap';
//import ReactPaginate from 'react-paginate';
import axios from 'axios';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import AnswerEditor from '../AnswerEditor/AnswerEditor';
import renderHTML from 'react-render-html';
import { msgstore_apis, david_test_apis, user_tracking_apis } from '../../config';

const fake_reponse = {
    "spaceId": "spaceId",
    "createdBy": "createdBy",
    "topics": [{
        "topics": {
            "label": "label"
        }
    }, {
        "topics": {
            "label": "label"
        }
    }],
    "answers": [{
        "answers": {
            "questionId": "questionId",
            "comments": [{
                "replies": {
                    "answerId": "answerId",
                    "replies": [{}, {}],
                    "createdBy": "John Smith",
                    "parentCommentId": "parentCommentId",
                    "_id": "_id",
                    "commentText": "Velit aute mollit ipsum ad dolor consectetur nulla officia culpa adipisicing exercitation fugiat tempor. Voluptate deserunt sit sunt nisi aliqua fugiat proident ea ut. Mollit voluptate reprehenderit occaecat nisi ad non minim tempor sunt voluptate consectetur exercitation id ut nulla. Ea et fugiat aliquip nostrud sunt incididunt consectetur culpa aliquip eiusmod dolor. Anim ad Lorem aliqua in cupidatat nisi enim eu nostrud do aliquip veniam minim.",
                    "createdOn": "2000-01-23T04:56:07.000+00:00"
                }
            }, {
                "replies": {
                    "answerId": "answerId",
                    "replies": [{}, {}],
                    "createdBy": "Somebody",
                    "parentCommentId": "parentCommentId",
                    "_id": "_id",
                    "commentText": "Here is a comment",
                    "createdOn": "2000-01-23T04:56:07.000+00:00"
                }
            }],
            "answerText": "<ul><li>dag</li><li>sdgd</li><li>sgdg</li></ul>",
            "createdBy": "createdBy",
            "_id": "_id",
            "createdOn": "2000-01-23T04:56:07.000+00:00"
        }
    }, {
        "answers": {
            "questionId": "questionId",
            "comments": [{
                "replies": {
                    "answerId": "answerId",
                    "replies": [{}, {}],
                    "createdBy": "createdBy",
                    "parentCommentId": "parentCommentId",
                    "_id": "_id",
                    "commentText": "commentText",
                    "createdOn": "2000-01-23T04:56:07.000+00:00"
                }
            }, {
                "replies": {
                    "answerId": "answerId",
                    "replies": [{}, {}],
                    "createdBy": "createdBy",
                    "parentCommentId": "parentCommentId",
                    "_id": "_id",
                    "commentText": "commentText",
                    "createdOn": "2000-01-23T04:56:07.000+00:00"
                }
            }],
            "answerText": "<p>Test2 Test2 Test2</p>",
            "createdBy": "createdBy",
            "_id": "_id",
            "createdOn": "2000-01-23T04:56:07.000+00:00"
        }
    }],
    "_id": "_id",
    "createdOn": "2000-01-23T04:56:07.000+00:00",
    "questionText": "questionText"
}

export class CommentPanel extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            comment_text: false,
            show_comments: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onChange = (e) => {
        //        console.log(e.target.value)
        this.setState({ 'comment_text': e.target.value })
    }

    handleSubmit = (e) => {
        console.log(this.props.data);
        const data = {
            commentText: this.state.comment_text,
            answer_id: this.props.answerId
        }
        console.log(data)
    }
    render() {
        const { comment_text } = this.state

        let comment_list = null;
        if (this.state.show_comments === true)
            comment_list = this.props.data.map((comment, idx) => {
                return (
                    <ListGroup.Item key={idx} style={{ border: 'none' }}>
                        <ul className="list-unstyled" style={{ 'padding': 0, margin: 0 }}>
                            <li style={{ 'fontWeight': 'bold', 'fontSize': 13 }}>{comment.replies.createdBy}</li>
                            <li className='comment_body'> {comment.replies.commentText}  </li>
                        </ul>
                    </ListGroup.Item>
                )
            });
        return (
            <div className="threaded_comments">
                <Form inline>
                    <Form.Group >
                        <Button size="sm" className="btn-circle">
                            <span className="fa fa-user fa-lg" style={{ color: 'FFFFFF' }}></span>
                        </Button>
                        <Form.Control style={{ 'margin-left': 12, 'width': 600 }}
                            as="textarea" rows="1" size="sm" type="text" placeholder="Add a comment..."
                            onChange={this.onChange} />
                        <Button style={{ 'margin-left': 12 }}
                            size="sm" disabled={!comment_text}
                            onClick={this.handleSubmit}>
                            Add Comment</Button>
                        <Button style={{ 'margin-left': 12 }} size="sm" variant="link" onClick={() => this.setState({ "show_comments": true })}> All </Button>
                    </Form.Group>
                </Form>
                <Collapse in={this.state.show_comments}>
                    <ListGroup>
                        {comment_list}
                    </ListGroup>
                </Collapse>
            </div>
        )
    }
}

export class AnswerList extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleUpvote = (value) => {
        console.log('upvote this answer', value)
    }

    handleDownvote = (value) => {
        console.log('downvote this answer', value)
    }

    render() {
        let details = null;
        if (this.props.data.length != 0) {
            details = this.props.data.map((post, idx) => {
                return (
                    <ListGroup.Item key={idx}>
                        <ul className="list-unstyled">
                            <li>{post.answers.createdBy} </li>
                            <li><small className="text-muted">Answered<Moment fromNow>{post.answers.createdOn}</Moment></small></li>
                        </ul>
                        <p>
                            {renderHTML(post.answers.answerText)}
                        </p>
                        <ButtonToolbar style={{ 'margin-left': -10 }}>
                            <Button className="q_page_button" variant="link" onClick={() => this.handleUpvote(post.answers._id)}>
                                <span className="fa fa-arrow-up"></span> Upvote</Button>
                            <Button className="q_page_button pull-right" variant="link" onClick={() => this.handleDownvote(post.answers._id)}>
                                <span className="fa fa-arrow-down"></span> Downvote</Button>
                        </ButtonToolbar>
                        <CommentPanel data={post.answers.comments} answerId={post.answers._id}></CommentPanel>
                    </ListGroup.Item>

                )
            });
        }
        else {
            details = (<ListGroup.Item><div>No Answer Yet</div></ListGroup.Item>)
        }
        return (
            <ListGroup variant="flush">
                {details}
            </ListGroup>
        )
    }
}

export class BadgeGroup extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    render() {
        let details = null;

        if (this.props.data.length !== 0) {
            details = this.props.data.map((post, idx) => {
                return (
                    <Badge pill variant="light" className='topic_pill' key={idx}>
                        {post.label}
                    </Badge>

                )
            });
        }
        else {
            details = (<div>No Answer Yet</div>)
        }
        return (
            <div >
                {details}
            </div>
        )
    }
}

export class AnswerInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer_string: null,
        }
    }
    static propTypes = {
        onChange: PropTypes.func
    };

    handleInputChange = (value) => {
        //       console.log(value);
        this.props.onChange(value);
        //       this.setState({ answer_string: value })
    }

    render() {
        return (
            <AnswerEditor onChange={this.handleInputChange} />
        )
    }
}

class QuestionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: "Yu Zhao",
            answer_input: false,
            question: {},
            questionId: this.props.match.params.questionId,
            followed: false,
            answer_string: null,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTY2ODI3MzksImlkIjoiNWNjNTIzNjA3MmM5YmYzNDM2ODJiNGIwIn0.2yvfGmvutYPygv_oPbj7QUdiDxVvxbh6o5eHYZ2CBUU'
        }
        this.handleFollow = this.handleFollow.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
    }

    componentDidMount() {
        axios.get(david_test_apis + '/questions', {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            },
            params: {
                questionId: this.state.questionId,
                depth: -1
            }
        }).then(response => {
            console.log(response.data)
            this.setState({
                question: response.data[0]
            })
        })
    }

    handleFollow() {
        console.log("follow this question");

        const data = {
            action: 'question',
            ids: [this.state.questionId],
            unfollow: false
        }
        console.log(data);

        axios.post(user_tracking_apis + '/userFollow', data, {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            }
        }).then(response => {
            console.log(response);
            this.setState({
                followed: true
            })
        }).catch(error => {
            console.log(error);
        });

    }

    handleSubmitAnswer = (e) => {
        e.preventDefault();
        const data = {
            answerText: this.state.answer_string,
        };
        console.log(data);

        axios.post(david_test_apis + '/answers', data, {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            },
            params: {
                'questionId': this.state.questionId
            }
        }).then(response => {
            console.log(response.data)
//            this.componentDidMount();
        })

    };




handleInput = (value) => {
    console.log(value);
    this.setState({ answer_string: value }, ()=>{
        console.log(this.state.answer_string)
    })
};

render() {
    //    console.log(this.state.question);
    let BadgeGroup_data = [];
    if ('topics' in this.state.question) {
        BadgeGroup_data = this.state.question.topics;
    }
    let AnswerList_data = [];
    if ('answers' in this.state.question) {
        AnswerList_data = this.state.question.answers;
    }
    return (
        <div>
            <Container>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <BadgeGroup data={BadgeGroup_data} />
                        <h4><b>{this.state.question.questionText}</b></h4>
                        <ButtonToolbar style={{ 'margin-left': -10 }}>
                            <Button className="q_page_button" variant="link" onClick={() => this.setState({ answer_input: !this.state.answer_input })}>
                                <span className="fa fa-edit"></span> Answer</Button>
                            <Button className="q_page_button" variant="link" onClick={this.handleFollow} disabled={this.state.followed}>
                                <span className="fa fa-plus-square"></span> {this.state.followed ? 'Followed' : 'Follow'}</Button>
                        </ButtonToolbar>
                        <Collapse in={this.state.answer_input}>
                            <Card>
                                <Card.Header>{this.state.user_name}</Card.Header>
                                <Card.Body>
                                    <AnswerInput q_id={this.state.question._id} onChange={this.handleInput} />
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <Button size="sm" onClick={this.handleSubmitAnswer}> Submit</Button>
                                </Card.Footer>
                            </Card>
                        </Collapse>
                    </ListGroup.Item>
                </ListGroup>

                <AnswerList data={AnswerList_data} />
            </Container>
        </div >
    )
}

}

const mapStateToProps = ({ authentication }) => ({ authentication });
export default connect(mapStateToProps)(QuestionPage);