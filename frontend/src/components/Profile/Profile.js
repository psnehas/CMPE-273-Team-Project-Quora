import React, { Component } from 'react';
import style from './Profile.module.css';
import { Container, Col, Row, Image, Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import Content from './Content/Content'
import Sidebar from './Sidebar/Sidebar';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import cookie from 'react-cookies';
import { backend_host } from '../../config';


import axios from 'axios';

class Profile extends Component {

    state = {
        // Upload New Avatar
        imageSrc: `${backend_host}/user_avatar/${this.props.match.params.uid}`,
        imageHash: Date.now(),
        show_edit_image: false,
        show_image_uploader: false,
        selectedFile: null,
        loaded: 0,
        // Update Profile Info
        editing_profile: false,
        new_first_name: "",
        new_first_name: "",
        new_last_name: "",
        new_profileCredential: "",
        new_about: ""
    };

    componentDidMount() {
        axios.get(`${backend_host}/profile/${this.props.match.params.uid}`, {
            headers: {
                'Authorization': `Bearer ${cookie.load('JWT')}`
            }
        }).then(res => {
            if (res.status === 200) {
                res.data.user_info.avatar = `${backend_host}/user_avatar/${this.props.match.params.uid}`
                this.props.dispatch(userActions.profile_update(res.data))
            }
        })

    }

    onOpenImageUploaderHandler = () => {
        this.setState({
            show_image_uploader: true
        })
    }

    onCloseImageUploaderHandler = () => {
        this.setState({
            show_image_uploader: false
        })
    }

    handleselectedFile = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    handleUpload = () => {
        if (!this.state.selectedFile) return;
        const data = new FormData()
        data.append('avatar', this.state.selectedFile, this.state.selectedFile.name)
        console.log(data);
        // TODO
        axios
            .post(`${backend_host}/user_avatar/${this.props.match.params.uid}`, data, {
                headers: {
                    'Authorization': `Bearer ${cookie.load('JWT')}`
                },
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    })
                },
            })
            .then(res => {
                console.log(res)
                this.setState({
                    imageSrc: `${backend_host}/user_avatar/${this.props.match.params.uid}`,
                    imageHash: Date.now()
                })
                this.props.dispatch(userActions.profile_update({ user_info: { avatar: `${backend_host}/user_avatar/${this.props.match.params.uid}` } }));

            })
    }

    onEditProfileHandler = () => {
        this.setState({
            editing_profile: true,
            new_first_name: this.props.profile.user_info.first_name,
            new_last_name: this.props.profile.user_info.last_name,
            new_profileCredential: this.props.profile.user_info.profileCredential,
            new_about: this.props.profile.user_info.about
        })
    }

    onDeactiveHandler = () => {
        axios.put(`${backend_host}/deactive`, null, {
            headers: {
                'Authorization': `Bearer ${cookie.load('JWT')}`
            }
        }).then(res => {
            console.log(res);
            this.props.dispatch(userActions.logout());
            cookie.remove('JWT', { path: '/' });
        })
    }

    onCancelEditProfileHandler = () => {
        this.setState({
            editing_profile: false
        })
    }

    onSaveEditProfileHandler = () => {

        let new_user_info = {
            avatar: this.props.profile.user_info.avatar,
            first_name: this.state.new_first_name,
            last_name: this.state.new_last_name,
            profileCredential: this.state.new_profileCredential,
            about: this.state.new_about,
        }

        console.log("Before dispatch", new_user_info);



        this.props.dispatch(userActions.profile_update({ user_info: new_user_info }));

        console.log("new profile", this.props.profile.user_info);

        let data = {
            ...this.props.profile.user_info,
            ...new_user_info
        }

        axios.put(`${backend_host}/profile/update_info`, data,
            {
                headers: {
                    'Authorization': `Bearer ${cookie.load('JWT')}`
                }
            }).then(res => {
                console.log("Update Profile", res)
            })

        this.setState({
            editing_profile: false,
        });
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onChangeFollowHandler = () => {
        if (this.props.profile.followed) {
            axios.put(`${backend_host}/unfollow_user/${this.props.match.params.uid}`, null,
                {
                    headers: {
                        'Authorization': `Bearer ${cookie.load('JWT')}`
                    }
                }).then(res => {
                    console.log("Unfollow user", res)
                    let new_profile = {
                        ...this.props.profile,
                        followed: false
                    }
                    this.props.dispatch(userActions.profile_update(new_profile));
                })
        } else {
            axios.put(`${backend_host}/follow_user/${this.props.match.params.uid}`, null,
                {
                    headers: {
                        'Authorization': `Bearer ${cookie.load('JWT')}`
                    }
                }).then(res => {
                    console.log("follow user", res);
                    let new_profile = {
                        ...this.props.profile,
                        followed: true
                    }
                    this.props.dispatch(userActions.profile_update(new_profile));
                })
        }
    }

    render() {

        let profile_content = (
            <div>
                <h1>{this.props.profile.user_info.first_name}&nbsp;{this.props.profile.user_info.last_name}</h1>
                <p>{this.props.profile.user_info.profileCredential}</p>
                <p>{this.props.profile.user_info.about}</p>
                {this.props.authentication.user_id === this.props.match.params.uid ? (
                    <div>
                        <Button onClick={this.onEditProfileHandler}>Edit</Button>
                        &nbsp;
                        <Button onClick={this.onDeactiveHandler} variant="danger" >Deactive</Button>
                    </div>
                ) : <Button variant="link" onClick={this.onChangeFollowHandler}><span className="fa fa-plus-square"></span>&nbsp;{this.props.profile.followed ? 'Unfollow' : 'Follow'}</Button>}
            </div>
        )

        let profile_edit = (
            <div>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="new_first_name">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First Name" value={this.state.new_first_name} onChange={this.onChangeHandler} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="new_last_name">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" value={this.state.new_last_name} onChange={this.onChangeHandler} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group controlId="new_profileCredential">
                        <Form.Label>Profile Credential</Form.Label>
                        <Form.Control type="text" placeholder="Profile Credential" value={this.state.new_profileCredential} onChange={this.onChangeHandler} />
                    </Form.Group>
                    <Form.Group controlId="new_about">
                        <Form.Label>About</Form.Label>
                        <Form.Control type="text" placeholder="About" value={this.state.new_about} onChange={this.onChangeHandler} />
                    </Form.Group>

                    <Button onClick={this.onCancelEditProfileHandler} className={style.marginRight}>Cancel</Button>
                    <Button onClick={this.onSaveEditProfileHandler}>Save</Button>

                </Form>
            </div>
        )
        console.log("image src", `${this.props.profile.user_info.avatar}?${Date.now()}`)
        return (
            <React.Fragment>
                {
                    this.props.profile.active ?
                        <Container>
                            <Row>
                                <Col className={style.center}>
                                    <div className={style.profile_photo_image_wrapper} onMouseEnter={() => this.setState({ show_edit_image: true })} onMouseLeave={() => this.setState({ show_edit_image: false })}>
                                        <Image className={style.profile_photo_image} src={`${this.props.profile.user_info.avatar}?${Date.now()}`} roundedCircle />
                                        {this.state.show_edit_image ? <span className={style.edit_text} onClick={this.onOpenImageUploaderHandler}>Edit</span> : null}
                                        {/* <span className={style.edit_text} onClick={this.onOpenImageUploaderHandler}>Edit</span> */}
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    {this.state.editing_profile ? profile_edit : profile_content}
                                </Col>
                            </Row>
                            <hr />

                            <Row>
                                <Col>
                                    <Sidebar uid={this.props.match.params.uid} />
                                </Col>
                                <Col xs={8}>
                                    <Content uid={this.props.match.params.uid} />
                                </Col>
                            </Row>


                            <Modal show={this.state.show_image_uploader} onHide={this.onCloseImageUploaderHandler}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modal heading</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Control type="file" onChange={this.handleselectedFile} />
                                    <br />
                                    <div> {Math.round(this.state.loaded, 2)} %</div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.onCloseImageUploaderHandler}>
                                        Close
                            </Button>
                                    <Button variant="primary" onClick={this.handleUpload}>
                                        Save Changes
                            </Button>
                                </Modal.Footer>
                            </Modal>

                        </Container>
                        :
                        <Container>
                            <h1>User Not Found</h1>
                        </Container>
                }
            </React.Fragment>
        )
    }



}

// reducer: profile 's output maps to this.props.profile.user_info
const mapStateToProps = ({ authentication, profile }) => ({ authentication, profile });
// apply above mapping to Login class
export default connect(mapStateToProps)(Profile);