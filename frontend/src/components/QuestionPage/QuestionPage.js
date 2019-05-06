import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
//import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import './QuestionPage.css';
import { ListGroup, Container, Badge, ButtonToolbar, Button, Collapse, Card, Form } from 'react-bootstrap';
//import ReactPaginate from 'react-paginate';
import axios from 'axios';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import AnswerEditor from '../AnswerEditor/AnswerEditor';
import renderHTML from 'react-render-html';
import { david_test_apis, user_tracking_apis, backend_host } from '../../config';

export class CommentPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment_text: '',
            show_comments: false,
            comments: [],
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTY5NDg3NDksImlkIjoiNWNjOTMyN2VmMzYzOTMwMDAxZDkzMzIxIn0.1PyIZ9tVZCH9ihiF8KHTv8McvGlAwhBHor8GGPd7QKc'
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reload_comments = this.reload_comments.bind(this);
    }
    onChange = (e) => {
        //        console.log(e.target.value)
        this.setState({ 'comment_text': e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //        console.log(this.props.data);
        const data = {
            commentText: this.state.comment_text,
        };
        axios.post(david_test_apis + '/comments', data, {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            },
            params: {
                answerId: this.props.answerId
            }
        }).then(response => {
            this.reload_comments();
        }).catch(error => {
            console.log(error);
        })

    }

    reload_comments = () => {
        axios.get(david_test_apis + '/comments', {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            },
            params: {
                answerId: this.props.answerId,
                depth: 0
            }
        }).then(response => {
            this.setState({
                comments: response.data,
                show_comments: true,
                comment_text: ""
            })
        }).catch(error => {
            console.log(error);
        })

    }
    showComments = (e) => {
        e.preventDefault();
        axios.get(david_test_apis + '/comments', {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            },
            params: {
                answerId: this.props.answerId,
                depth: 0
            }
        }).then(response => {
            this.setState({
                'show_comments': true,
                'comments': response.data
            })
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        const { comment_text } = this.state

        let comment_list = null;
        if (this.state.show_comments === true) {

            if (this.state.comments && this.state.comments.length !== 0) {
                comment_list = this.state.comments.map((comment, idx) => {
                    return (
                        <ListGroup.Item key={idx} style={{ border: 'none' }}>
                            <ul className="list-unstyled" style={{ 'padding': 0, margin: 0 }}>
                                <li style={{ 'fontWeight': 'bold', 'fontSize': 13 }}>{comment.displayName}</li>
                                <li className='comment_body'> {comment.commentText}  </li>
                            </ul>
                        </ListGroup.Item>
                    )
                });
            }
            else {

                comment_list = (<ListGroup.Item style={{ border: 'none' }}>
                    <ul className="list-unstyled" style={{ 'padding': 0, margin: 0 }}>
                        <li style={{ 'fontWeight': 'bold', 'fontSize': 13 }}>Be the first to comment this answer!</li>
                    </ul>
                </ListGroup.Item>)

            }
        }
        let close_comments = null;
        if (this.state.show_comments === true) {
            close_comments = <Button style={{ 'marginLeft': 12 }} size="sm" variant="link" onClick={() => this.setState({ show_comments: false })}> Close </Button>
        }

        return (
            <div className="threaded_comments">
                <Form inline>
                    <Form.Group >
                        <Button size="sm" className="btn-circle">
                            <span className="fa fa-user fa-lg" style={{ color: 'FFFFFF' }}></span>
                        </Button>
                        <Form.Control style={{ 'marginLeft': 12, 'width': 600 }}
                            as="textarea" rows="1" size="sm" type="text" placeholder="Add a comment..."
                            onChange={this.onChange} value={this.state.comment_text} />
                        <Button style={{ 'marginLeft': 12 }}
                            size="sm" disabled={!comment_text}
                            onClick={this.handleSubmit}>
                            Add Comment</Button>
                        <Button style={{ 'marginLeft': 12 }} size="sm" variant="link" onClick={this.showComments}> All </Button>
                        {close_comments}
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

export class AnswerEdit extends Component {
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

export class AnswerList extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            edit_box: false
        }
    }
    handleUpvote = (value) => {
        console.log('upvote this answer', value)
    }

    handleDownvote = (value) => {
        console.log('downvote this answer', value)
    }

    handleBookmark = (value) => {
        console.log('bookmard this answer', value)
    }

    handleEdit = (value) => {
        this.setState({ edit_box: true })
    }

    render() {
        let details = null;


        if (this.props.data.length !== 0) {
            details = this.props.data.map((post, idx) => {
                let answer = null;
                let edit_button = null;
                if (this.state.edit_box === true ) {
                    answer = <AnswerEditor value={post.answerText} onChange={() => { }}></AnswerEditor>;
                    if (post.createdBy.user_id === this.props.authentication.user_id)
                    edit_button = (<Button className="q_page_button pull-right" variant="link" onClick={() => this.handleUpdate(post._id)}>
                        <span className="fa fa-edit"></span> Update</Button>)
                }
                else {
                    answer = (<p>
                        {renderHTML(post.answerText)}
                    </p>);
                    if (post.createdBy.user_id === this.props.authentication.user_id)
                    edit_button = (<Button className="q_page_button pull-right" variant="link" onClick={() => this.handleEdit(post._id)}>
                        <span className="fa fa-edit"></span> Edit</Button>)

                }
                return (
                    <ListGroup.Item key={idx}>
                        <ul className="list-unstyled">
                            <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'profile/' + post.createdBy.user_id}>{post.createdBy.name},</Link><span style={{ marginLeft: 10 }}>{post.createdBy.crediential}</span></li>
                            <li><small className="text-muted">Answered <Moment fromNow>{post.createdOn}</Moment></small></li>
                        </ul>
                        {/* <p>
                            {renderHTML(post.answerText)}
                        </p> */}
                        {answer}
                        <ButtonToolbar style={{ 'margin-left': -10 }}>
                            <Button className="q_page_button" variant="link" onClick={() => this.handleUpvote(post._id)}>
                                <span className="fa fa-arrow-up"></span> Upvote  · {post.upvote}</Button>
                            <Button className="q_page_button pull-right" variant="link" onClick={() => this.handleDownvote(post._id)}>
                                <span className="fa fa-arrow-down"></span> Downvote  · {post.downvote}</Button>
                            <Button className="q_page_button pull-right" variant="link" onClick={() => this.handleBookmark(post._id)}>
                                <span className="fa fa-bookmark"></span> Bookmark</Button>
                                {edit_button}
                                {/*
                            <Button className="q_page_button pull-right" variant="link" onClick={() => this.handleEdit(post._id)}>
                                <span className="fa fa-edit"></span> Edit</Button>
                                */}
                        </ButtonToolbar>

                        <CommentPanel answerId={post._id}></CommentPanel>
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
                        <Link style={{ color: '#666' }} to={'/topics/' + post.name}>{post.name}</Link>
                    </Badge>

                )
            });
        }
        else {
            details = (<div>No Topic Yet</div>)
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
            user_name: this.props.authentication.first_name + ' ' + this.props.authentication.last_name,
            answer_input: false,
            question: {},
            questionId: this.props.match.params.questionId,
            followed: false,
            answer_string: null,
            token: cookie.load('JWT'),
            answer_anoymous: false
        }
        this.handleFollow = this.handleFollow.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
        this._onChangeAnoymous = this._onChangeAnoymous.bind(this);
    }

    componentDidMount() {
        const fake_data =
            { "success": "Question fetched", "data": { "answers": [{ upvote: 1, downvote: 2, createdBy: { name: "Someone", user_id: 123456, crediential: "Test Only" }, 'answerText': "<p><strong>I don't know</strong></p>", "_id": 123 }], "follower": 5, "_id": "5ccf392b1b83d55e4c6c85fe", "question_text": "how is the weather", "display_name": "Avi", "questionTopics": [{ "_id": "5ccf392b1b83d55e4c6c8600", "topic_id": 3, "name": "Test Topic 3" }, { "_id": "5ccf392b1b83d55e4c6c85ff", "topic_id": 1, "name": "Test Topic 1" }], "dateCreated": "2019-05-05T19:27:39.497Z", "question_id": 16, "__v": 0 } }

        axios.get(backend_host + '/questions/16', {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
            //            params: {
            //                questionId: this.state.questionId,
            //                depth: 1
            //            }
        }).then(response => {
            //console.log(response.data)
            this.setState({
                //                question: response.data.data
                question: fake_data.data
            })
        })
    }

    handleFollow() {
        //        console.log("follow this question");

        const data = {
            action: 'question',
            ids: [this.state.questionId],
            unfollow: false
        }
        //        console.log(data);

        axios.post(user_tracking_apis + '/userFollow', data, {
            headers: {
                'Authorization': `JWT ${this.state.token}`
            }
        }).then(response => {
            //            console.log(response);
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
            console.log(response.data);
            this.setState({ answer_input: false });
            this.componentDidMount();
        })

    };




    handleInput = (value) => {
        //        console.log(value);
        this.setState({ answer_string: value }, () => {
            //            console.log(this.state.answer_string)
        })
    };

    _onChangeAnoymous(e) {
        this.setState({ answer_anoymous: e.target.checked });
    }

    render() {
        //    console.log(this.state.question);
        let BadgeGroup_data = [];
        if ('questionTopics' in this.state.question) {
            BadgeGroup_data = this.state.question.questionTopics;
        }
        let AnswerList_data = [];
        if ('answers' in this.state.question) {
            AnswerList_data = this.state.question.answers;
        }
        let redirectVar = null;
        if (this.props.authentication.loggedIn !== true) {
            //            redirectVar = <Redirect to="/login" />
        }
        return (
            <div>
                <Container>
                    {redirectVar}
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <BadgeGroup data={BadgeGroup_data} />
                            <h4><b>{this.state.question.question_text}</b></h4>
                            <ButtonToolbar style={{ 'marginLeft': -10 }}>
                                <Button className="q_page_button" variant="link" onClick={() => this.setState({ answer_input: !this.state.answer_input })}>
                                    <span className="fa fa-edit"></span> Answer</Button>
                                <Button className="q_page_button" variant="link" onClick={this.handleFollow} disabled={this.state.followed}>
                                    <span className="fa fa-plus-square"></span> {this.state.followed ? 'Followed' : 'Follow'}  ·  {this.state.question.follower}</Button>
                            </ButtonToolbar>
                            <Collapse in={this.state.answer_input}>
                                <Card>
                                    <Card.Header>{this.state.user_name}</Card.Header>
                                    <Card.Body>
                                        <AnswerInput q_id={this.state.question._id} onChange={this.handleInput} />
                                    </Card.Body>
                                    <Card.Footer className="text-muted">
                                        <input
                                            type="checkbox"
                                            onChange={this._onChangeAnoymous}
                                            checked={this.state.answer_anoymous}
                                        />
                                        <span style={{ fontSize: 14, marginRight: 10 }}>   Answer anoymously </span>
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