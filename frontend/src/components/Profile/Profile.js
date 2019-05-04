import React, { Component } from 'react';
import style from './Profile.module.css';
import { Container, Col, Row, Image, Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import Content from './Content/Content'
import Sidebar from './Sidebar/Sidebar';

class Profile extends Component {

    state = {
        user_info: {},
        created_answers: [],
        bookmarked_answers: [],
        created_questions: [],
        followed_people: [],
        following_people: [],
        show_edit_image: false,
        show_image_uploader: false
    };

    componentDidMount() {

        let fake_response = {
            data: {
                user_info: {
                    avatar: "https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1425070395/lch84n574ygfa3xr5irq.png",
                    first_name: "Yuxiang",
                    last_name: "Chen",
                    profileCredential: "string",
                    about: "string"
                },
                created_answers: [
                    {
                        id: "string",
                        title: "string",
                        created_time: moment().unix()
                    }
                ],
                bookmarked_answers: [
                    {
                        id: "string",
                        title: "string",
                        bookmarked_time: moment().unix()
                    }
                ],
                created_questions: [
                    {
                        id: "string",
                        title: "string",
                        created_time: moment().unix()
                    }
                ],
                followed_people: [
                    {
                        id: "string",
                        first_name: "string",
                        last_name: "string"
                    }
                ],
                following_people: [
                    {
                        id: "string",
                        first_name: "string",
                        last_name: "string"
                    }
                ]
            }
        }

        let {
            user_info,
            created_answers,
            bookmarked_answers,
            created_questions,
            followed_people,
            following_people } = fake_response.data;

        user_info.uid = this.props.match.params.uid

        this.setState({
            user_info,
            created_answers,
            bookmarked_answers,
            created_questions,
            followed_people,
            following_people
        })
    }

    onOpenImageUploaderHandler = () => {
        this.setState({
            show_image_uploader: true
        })
    }

    onCloseImageUploaderHandler = () =>{
        this.setState({
            show_image_uploader: false
        })
    }


    render() {

        let context = {
            created_answers: this.state.created_answers,
            bookmarked_answers: this.state.bookmarked_answers,
            created_questions: this.state.created_questions,
            followed_people: this.state.followed_people,
            following_people: this.state.following_people
        }

        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col className={style.center}>
                            <div className={style.profile_photo_image_wrapper} onMouseEnter={() => this.setState({ show_edit_image: true })} onMouseLeave={() => this.setState({ show_edit_image: false })}>
                                <Image className={style.profile_photo_image} src={this.state.user_info.avatar} roundedCircle />
                                {this.state.show_edit_image ? <span className={style.edit_text} onClick={this.onOpenImageUploaderHandler}>Edit</span> : null}
                            </div>
                        </Col>
                        <Col xs={8}>
                            <h1>{this.state.user_info.first_name}&nbsp;{this.state.user_info.last_name}</h1>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <Sidebar uid={this.state.user_info.uid} />
                        </Col>
                        <Col xs={8}>
                            <Content uid={this.state.user_info.uid} data={context} />
                        </Col>
                    </Row>
                    <Modal show={this.state.show_image_uploader} onHide={this.onCloseImageUploaderHandler}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.onCloseImageUploaderHandler}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.onCloseImageUploaderHandler}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </Container>
            </React.Fragment>
        )
    }



}

export default Profile;