import React, { Component } from 'react';
import { Container, Row, Button, Form, Card, Pagination, Modal } from 'react-bootstrap';
import cookie from 'react-cookies';
import axios from 'axios';
import { backend_host } from '../../config'

class AnalysisPage extends Component {

    render() {
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <h3 className="ml-auto mr-auto">Stats Page</h3>
                    </Row>
                    <Row>
                        Charts
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default AnalysisPage;