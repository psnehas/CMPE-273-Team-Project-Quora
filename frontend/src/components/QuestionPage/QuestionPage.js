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
            token: cookie.load('JWT')
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
            comment: this.state.comment_text,
            anonymous: false
        };
        axios.post(backend_host + '/answer/' + this.props.answerId + '/comment', data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            }
        }).then(response => {
            this.reload_comments();
        }).catch(error => {
            console.log(error);
        })

    }

    reload_comments = () => {
        axios.get(backend_host + '/answer_comments/'  + this.props.answerId, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
//            params: {
//                answerId: this.props.answerId,
//                depth: 0
//            }
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
        axios.get(backend_host + '/answer_comments/' + this.props.answerId, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
 //           params: {
 //               answerId: this.props.answerId,
 //               depth: 0
//            }
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

            if (this.state.comments && this.state.comments.comments.length !== 0) {
                comment_list = this.state.comments.comments.map((post, idx) => {
                    return (
                        <ListGroup.Item key={idx} style={{ border: 'none' }}>
                            <ul className="list-unstyled" style={{ 'padding': 0, margin: 0 }}>
                            <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'/profile/' + post.owner._id}>{post.owner.user_info.first_name} {post.owner.user_info.last_name}</Link></li>
                                <li className='comment_body'> {post.comment}  </li>
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
        data: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            edit_box: false,
            answer_string: null,
            token: cookie.load('JWT')
        }
    }
    handleUpvote = (idx, value) => {
        console.log('upvote this answer', value);
        const data = {};
        axios.put(backend_host + '/answer/' + value + '/upvote', data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
        }).then(response => {
            console.log(response.data);
            this.props.data[idx].upvote = response.data.upvotes;
            this.forceUpdate();
            //            this.componentDidMount();
        })
    }

    handleDownvote = (idx,value) => {
        console.log('downvote this answer', value);
        const data = {};
        axios.put(backend_host + '/answer/' + value + '/downvote', data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
        }).then(response => {
            console.log(response.data);
            this.props.data[idx].downvote = response.data.downvote;
            this.forceUpdate();
            //            this.componentDidMount();
        })
    }

    handleBookmark = (value) => {
        const data = {};
        axios.post(backend_host + '/bookmark/answer/' + value, data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
        }).then(response => {
            console.log(response.data);
 //        this.props.data[idx].content = this.state.answer_string;
            this.forceUpdate();
            //window.location.reload();
            //            this.componentDidMount();
        }) 
        console.log('bookmard this answer', value)
    }

    handleEdit = (value) => {
        this.setState({ edit_box: true })
    }

    handleChange = (value) => {
        //        console.log(value);
        this.setState({ answer_string: value }, () => {
            //            console.log(this.state.answer_string)
        })
    };

    handleUpdate = (idx, value) => {
        const data = {
            content: this.state.answer_string,
            //            anonymous: this.state.answer_anonymous
        };
        console.log(data);

        axios.put(backend_host + '/answer/' + value, data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
        }).then(response => {
            console.log(response.data);
            this.setState({ edit_box: false });
            this.props.data[idx].content = this.state.answer_string;
            this.forceUpdate();
            //window.location.reload();
            //            this.componentDidMount();
        })
    }

    render() {
        let details = null;


        if (this.props.data.length !== 0) {
            details = this.props.data.map((post, idx) => {
                let answer = null;
                let edit_button = null;
                if (this.state.edit_box === true) {
                    answer = <AnswerEditor value={post.content} onChange={this.handleChange}></AnswerEditor>;
                     if (post.owner._id === this.props.user_id)
                    edit_button = (<Button className="q_page_button pull-right" variant="link" onClick={() => this.handleUpdate(idx,post._id)}>
                        <span className="fa fa-edit"></span> Update</Button>)
                }
                else {
                    answer = (<p>
                        {renderHTML(post.content)}
                    </p>);
                    if (post.owner._id === this.props.user_id)
                    edit_button = (<Button className="q_page_button pull-right" variant="link" onClick={() => this.handleEdit(post._id)}>
                        <span className="fa fa-edit"></span> Edit</Button>)

                }

                let displayName = (<ul className="list-unstyled">
                    <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'/profile/' + post.owner._id}>{post.owner.user_info.first_name} {post.owner.user_info.last_name}, </Link><span style={{ marginLeft: 10 }}>{post.owner.user_info.profileCredential}</span></li>
                    <li><small className="text-muted">Answered <Moment fromNow>{post.time}</Moment></small></li>
                </ul>)
                if (post.anonymous === true) {
                    displayName = (<ul className="list-unstyled">
                        <li style={{ fontSize: 14 }}>Anonymous User</li>
                        <li><small className="text-muted">Answered <Moment fromNow>{post.time}</Moment></small></li>
                    </ul>)
                }
                return (
                    <ListGroup.Item key={idx}>
                        {displayName}

                        {/*<ul className="list-unstyled">
                            <li style={{ fontSize: 14 }}><Link style={{ color: 'black' }} to={'profile/' + post.createdBy.user_id}>{post.createdBy.name},</Link><span style={{ marginLeft: 10 }}>{post.createdBy.crediential}</span></li>
                            <li><small className="text-muted">Answered <Moment fromNow>{post.createdOn}</Moment></small></li>
                        </ul>*/}
                        {/* <p>
                            {renderHTML(post.answerText)}
                        </p> */}
                        {answer}
                        <ButtonToolbar style={{ 'marginLeft': -10 }}>
                            <Button className="q_page_button" variant="link" onClick={() => this.handleUpvote(idx, post._id)}>
                                <span className="fa fa-arrow-up"></span> Upvote  · {post.upvote}</Button>
                            <Button className="q_page_button pull-right" variant="link" onClick={() => this.handleDownvote(idx, post._id)}>
                                <span className="fa fa-arrow-down"></span> Downvote  · {post.downvote}</Button>
                            <Button className="q_page_button pull-right" disabled={post.bookmarked} variant="link" onClick={() => this.handleBookmark(post._id)}>
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
                        <Link style={{ color: '#666' }} to={'/topics/' + post._id}>{post.label}</Link>
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
            answer_anonymous: false
        }
        this.handleFollow = this.handleFollow.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
        this._onChangeAnonymous = this._onChangeAnonymous.bind(this);
    }

    componentDidMount() {
        //        const fake_data =
        //            { "success": "Question fetched", "data": { "followed": false, "answers": [{ anoymous: true, bookmarked: true, upvote: 1, downvote: 2, createdBy: { name: "Someone", user_id: 123456, crediential: "Test Only" }, 'answerText': "<p><strong>I don't know</strong></p>", "_id": 123 }], "follower": 5, "_id": "5ccf392b1b83d55e4c6c85fe", "question_text": "how is the weather", "display_name": "Avi", "questionTopics": [{ "_id": "5ccf392b1b83d55e4c6c8600", "topic_id": 3, "name": "Test Topic 3" }, { "_id": "5ccf392b1b83d55e4c6c85ff", "topic_id": 1, "name": "Test Topic 1" }], "dateCreated": "2019-05-05T19:27:39.497Z", "question_id": 16, "__v": 0 } }

        axios.get(backend_host + '/questions/' + this.state.questionId, {
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
                question: response.data.question,
                followed: response.data.questionFollowed,
                followers: response.data.question.followers
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

        axios.post(backend_host + '/userFollow', data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
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
            content: this.state.answer_string,
            anonymous: this.state.answer_anonymous
        };
        console.log(data);

        axios.post(backend_host + '/question/' + this.state.questionId + '/answer', data, {
            headers: {
                'Authorization': `Bearer ${this.state.token}`
            },
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

    _onChangeAnonymous(e) {
        this.setState({ answer_anonymous: e.target.checked });
    }

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
        let redirectVar = null;
        if (this.props.authentication.loggedIn !== true) {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div>
                <Container>
                    {redirectVar}
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <BadgeGroup data={BadgeGroup_data} />
                            <h4><b>{this.state.question.content}</b></h4>
                            <ButtonToolbar style={{ 'marginLeft': -10 }}>
                                <Button className="q_page_button" variant="link" onClick={() => this.setState({ answer_input: !this.state.answer_input })}>
                                    <span className="fa fa-edit"></span> Answer</Button>
                                <Button className="q_page_button" variant="link" onClick={this.handleFollow} disabled={this.state.followed}>
                                    <span className="fa fa-plus-square"></span> {this.state.followed ? 'Followed' : 'Follow'}  ·  {this.state.question.followers}</Button>
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
                                            onChange={this._onChangeAnonymous}
                                            checked={this.state.answer_anonymous}
                                        />
                                        <span style={{ fontSize: 14, marginRight: 10 }}>   Answer anonymously </span>
                                        <Button size="sm" onClick={this.handleSubmitAnswer}> Submit</Button>
                                    </Card.Footer>
                                </Card>
                            </Collapse>
                        </ListGroup.Item>
                    </ListGroup>

                    <AnswerList data={AnswerList_data} user_id={this.props.authentication.user_id}/>
                </Container>
            </div>
        )
    }

}

const mapStateToProps = ({ authentication }) => ({ authentication });
export default connect(mapStateToProps)(QuestionPage);