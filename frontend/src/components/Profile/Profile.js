import React, { Component } from 'react';
import style from './Profile.module.css';
import { Container, Col, Row, Image, Card, Button } from 'react-bootstrap';

class Profile extends Component {

    state = {
        user: {}
    };

    componentDidMount() {
        let user = {
            name: "YC",
            profile_image: "https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1425070395/lch84n574ygfa3xr5irq.png"
        }

        this.setState({
            user
        })
    }


    render() {
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <Col>
                            <Image className={style.profile_photo_image} src={this.state.user.profile_image} roundedCircle />
                        </Col>
                        <Col xs={8}>
                            <h1>{this.state.user.name}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col xs={8}></Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }



}

export default Profile;