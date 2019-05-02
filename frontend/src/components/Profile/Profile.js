import React, { Component } from 'react';
import style from './Profile.module.css';
import { Container, Col, Row, Image, Card, Button } from 'react-bootstrap';

import Content from './Content/Content'
import Sidebar from './Sidebar/Sidebar';

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
                        <Col className={style.center}>
                            <Image className={style.profile_photo_image} src={this.state.user.profile_image} roundedCircle />
                        </Col>
                        <Col xs={8}>
                            <h1>{this.state.user.name}</h1>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            <Sidebar />
                        </Col>
                        <Col xs={8}>
                            <Content />
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }



}

export default Profile;