import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
import './Home.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import { Container, Col, Card, Button, Row } from 'react-bootstrap';
import AddModal from '../NavBar/Add_Q_Modal';
import TopicModal from '../Sidebar/TopicModal';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar_links: [],
            questions: [],
            show_add: false,
            user_name: 'Yu Zhao'
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
        const sidebar_links = [
            { name: "Movies", url: "topics/1" },
            { name: "Food", url: "topics/2" }
        ];

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
            sidebar_links: sidebar_links,
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
        }
        let modal_Q_Close = () => this.setState({ show_add: false });

        return (

            <div>
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