import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { userActions } from '../../../../_actions';
import { backend_host } from '../../../../config';
import cookie from 'react-cookies';
import axios from 'axios';

import style from '../../Profile.module.css';

const educations = () => {
    return {
        school: '',
        concentration: '',
        secondaryConcentration: '',
        degreeType: '',
        graduationYear: ''
    };
}

const careers = () => {
    return {
        position: '',
        company: '',
        starYear: '',
        endYear: ''
    }
}

const schemas = {
    educations: educations,
    careers: careers
}

class ProfileContent extends Component {

    state = {
        editing_profile: false,
        city: '',
        state: '',
        zipCode: '',
        educations: [],
        careers: []
    }

    onEditProfileHandler = () => {

        let new_state = {
            editing_profile: !this.state.editing_profile
        }

        if (!this.state.editing_profile) {
            new_state = {
                ...new_state,
                city: this.props.profile.user_info.city,
                state: this.props.profile.user_info.state,
                zipCode: this.props.profile.user_info.zipCode,
                educations: this.props.profile.user_info.educations,
                careers: this.props.profile.user_info.careers
            }
        }

        this.setState(new_state);
    }

    onSaveProfileHandler = () => {
        console.log("Profile update", this.state);

        let payload = {
            ...this.state
        };
        delete payload.editing_profile;
        this.props.dispatch(userActions.profile_update({ user_info: payload }));

        let data = {
            ...this.props.profile.user_info,
            ...payload
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
            editing_profile: false
        })
    }

    onAddHandler = (key) => {
        let new_state = {
            ...this.state
        };
        new_state[key].push(schemas[key]())
        this.setState(new_state);
    }

    onChangeHandler = (e) => {
        this.setState({ [e.target.id]: e.target.value });
        console.log(e.target.value)
        console.log(this.state)
    };

    onNewItemHandler = (e, type, index, field) => {
        let new_items = [...this.state[type]];
        new_items[index][field] = e.target.value;
        this.setState({
            [type]: new_items
        })
    }

    render() {

        const profile_display = (
            <div>
                <p>{`Email: ${this.props.profile.user_info.email}`}</p>
                <p>{`City: ${this.props.profile.user_info.city}`}</p>
                <p>{`State: ${this.props.profile.user_info.state}`}</p>
                <p>{`ZipCode: ${this.props.profile.user_info.zipCode}`}</p>
                <hr />
                <h3>Educations</h3>
                {this.props.profile.user_info.educations.map((edu, index) => {
                    return (
                        <div key={index}>
                            <ListGroup>
                                <ListGroup.Item>
                                    School: {edu.school}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Concentration: {edu.concentration}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Secondary Concentration: {edu.secondaryConcentration}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Degree Type: {edu.degreeType}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Graduation Year: {edu.graduationYear}
                                </ListGroup.Item>
                            </ListGroup>
                            <br />
                        </div>

                    )
                })}

                <h3>Careers</h3>
                {this.props.profile.user_info.careers.map((career, index) => {
                    return (
                        <div key={index}>
                            <ListGroup>
                                <ListGroup.Item>
                                    Position: {career.position}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Company: {career.company}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Star Year: {career.starYear}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    End Year: {career.endYear}
                                </ListGroup.Item>
                            </ListGroup>
                            <br />
                        </div>
                    )
                })}
                {this.props.authentication.user_id === this.props.match.params.uid ? <Button onClick={this.onEditProfileHandler}>Edit</Button> : null}
            </div>
        )

        const profile_edit = (
            <div>
                <p>{`Email: ${this.props.profile.user_info.email}`}</p>
                <Form>
                    <Form.Group controlId="city" as={Row}>
                        <Form.Label column sm="3">City:</Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="City" value={this.state.city} onChange={this.onChangeHandler} />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="state" as={Row}>
                        <Form.Label column sm="3">State:</Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="State" value={this.state.state} onChange={this.onChangeHandler} />
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="zipCode" as={Row}>
                        <Form.Label column sm="3">Zip Code:</Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="Zip Code" value={this.state.zipCode} onChange={this.onChangeHandler} />
                        </Col>
                    </Form.Group>
                    <hr />
                    <h3>Educations</h3>
                    {
                        this.state.educations.map((edu, index) => {
                            return (
                                <div key={index}>
                                    <Card>
                                        <Card.Header>New Education</Card.Header>
                                        <Card.Body>
                                            <Form.Group controlId={"school" + index} as={Row}>
                                                <Form.Label column sm="6">School:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="School" value={edu.school} onChange={e => this.onNewItemHandler(e, "educations", index, "school")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"concentration" + index} as={Row}>
                                                <Form.Label column sm="6">Concentration:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Concentration" value={edu.concentration} onChange={e => this.onNewItemHandler(e, "educations", index, "concentration")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"secondaryConcentration" + index} as={Row}>
                                                <Form.Label column sm="6">Secondary Concentration:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Secondary Concentration" value={edu.secondaryConcentration} onChange={e => this.onNewItemHandler(e, "educations", index, "secondaryConcentration")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"degreeType" + index} as={Row}>
                                                <Form.Label column sm="6">Degree Type:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Degree Type" value={edu.degreeType} onChange={e => this.onNewItemHandler(e, "educations", index, "degreeType")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"graduationYear" + index} as={Row}>
                                                <Form.Label column sm="6">Graduation Year:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Graduation Year" value={edu.graduationYear} onChange={e => this.onNewItemHandler(e, "educations", index, "graduationYear")} />
                                                </Col>
                                            </Form.Group>
                                        </Card.Body>
                                    </Card>
                                    <br />
                                </div>
                            )
                        })
                    }

                    <Button onClick={() => this.onAddHandler('educations')}>Add</Button>


                    <hr />
                    <h3>Careers</h3>

                    {
                        this.state.careers.map((career, index) => {
                            return (
                                <div key={index}>
                                    <Card>
                                        <Card.Header>New Career</Card.Header>
                                        <Card.Body>
                                            <Form.Group controlId={"position" + index} as={Row}>
                                                <Form.Label column sm="3">Position:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Position" value={career.position} onChange={e => this.onNewItemHandler(e, "careers", index, "position")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"company" + index} as={Row}>
                                                <Form.Label column sm="3">Company:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Company" value={career.company} onChange={e => this.onNewItemHandler(e, "careers", index, "company")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"starYear" + index} as={Row}>
                                                <Form.Label column sm="3">Star Year:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="Star Year" value={career.starYear} onChange={e => this.onNewItemHandler(e, "careers", index, "starYear")} />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group controlId={"endYear" + index} as={Row}>
                                                <Form.Label column sm="3">End Year:</Form.Label>
                                                <Col>
                                                    <Form.Control type="text" placeholder="End Year" value={career.endYear} onChange={e => this.onNewItemHandler(e, "careers", index, "endYear")} />
                                                </Col>
                                            </Form.Group>
                                        </Card.Body>
                                    </Card>
                                    <br />
                                </div>
                            )
                        })
                    }
                    <Button onClick={() => this.onAddHandler('careers')}>Add</Button>
                    <hr />

                    <Button onClick={this.onSaveProfileHandler}>Save</Button>&nbsp;
                    <Button onClick={this.onEditProfileHandler}>Cancel</Button>
                </Form>
            </div>
        )

        return (
            <React.Fragment>
                <h3 className={style.contentTitle}>
                    Profile
                </h3>
                {this.state.editing_profile ? profile_edit : profile_display}
            </React.Fragment>
        )
    }
}

// reducer: profile 's output maps to this.props.profile
const mapStateToProps = ({ authentication, profile }) => ({ authentication, profile });
// apply above mapping to Login class
export default connect(mapStateToProps)(ProfileContent);