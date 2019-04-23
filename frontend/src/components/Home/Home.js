import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
//import './Navbar.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import { Container, Col, Card, Button } from 'react-bootstrap';
import AddModal from '../NavBar/Add_Q_Modal';
import { throws } from 'assert';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar_links: [],
            questions: [], 
            show_add: false
        }
        this.showModal = this.showModal.bind(this);
    }

    showModal= (e) => {
        e.preventDefault();
        this.setState({
            show_add: true,
        })
    }

    componentDidMount() {
        const sidebar_links = [
            { name: "Movies", url: "topics/1" },
            { name: "Food", url: "topics/2" }
        ];

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
                            <Card.Link as={NavLink} to={'questions/'+q._id}>more</Card.Link>
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
        let modalClose = () => this.setState({show_add : false});

        return (

            <Container fluid>
                <AddModal
                show={this.state.show_add}
                onHide={modalClose}
                handleAdd={this.handleAdd}
                user_name= "Yu Zhao"
            />
                <Col xs={3} style={{ "margin-top": 50 }}>
                    <Sidebar links={this.state.sidebar_links} />
                </Col>
                <Col md={{ span: 8, offset: 3 }} style={{ "margin-top": -45, "margin-left": 160 }}>
                    <Card>
                    <Card.Body>
                            <Card.Title>Hi, Yu Zhao</Card.Title>
                            <Button variant="link" onClick={this.showModal}>What is your question?</Button>
                        </Card.Body>
                    </Card>

                    <br />

                    <Card>
                        <Card.Header as="h5"><span className="fa fa-question"></span> Questions for You</Card.Header>
                    </Card>    
                        {main_panel} </Col>
            </Container>
                )
            }
        }
        
const mapStateToProps = ({authentication}) => ({authentication});
export default connect(mapStateToProps)(Home);