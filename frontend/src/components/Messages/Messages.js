import React, { Component } from 'react';
import { Container, Row, Button, Form, Card, Pagination } from 'react-bootstrap';
import cookie from 'react-cookies';
import axios from 'axios';
import config from '../../config'

class Messages extends Component {

    state = {
        showInbox: false,
        sendMsg: false,
        newMsg: {
            from: cookie.load('email'),
            recipient: '',
            content: ''
        },
        messages: [],
        errMsg: '',
        active: 1
    }

    componentDidMount() {
        this.loadInbox();
    }

    loadInbox = () => {
        // axios.get(config.host + '/inbox_msg/' + cookie.load("uid"))
        //     .then((res) => {
        //         console.log("msg:", res.data);
        //         this.setState({
        //             messages: res.data
        //         })
        //     })
    }

    onInboxClickHandler = () => {
        this.setState({
            showInbox: !this.state.showInbox
        })
    }

    onNewMsgClickHandler = () => {
        this.setState({
            sendMsg: !this.state.sendMsg,
            errMsg: ''
        })
    }

    onChangeHandler = (e) => {
        let newMsg = { ...this.state.newMsg };
        newMsg[e.target.id] = e.target.value;
        this.setState({ newMsg });
    };

    sendNewMsg = () => {
        console.log("to:", this.state.newMsg.recipient, "content:", this.state.newMsg.content)
        // axios.post(config.host + '/new_msg', this.state.newMsg)
        //     .then((res) => {
        //         if (res.data === true) {
        //             this.setState({
        //                 errMsg: 'Sent!'
        //             });
        //         } else {
        //             this.setState({
        //                 errMsg: 'Failed!'
        //             });
        //         }
        //     })
    }

    onChangePageHandler = (num) => {
        this.setState({
            active: num
        })
    }

    render() {

        let new_message = (
            <React.Fragment>
                <h2>New Message</h2>
                <Form>
                    <Form.Group controlId="recipient">
                        <Form.Label>Recipient:</Form.Label>
                        <Form.Control type="text" placeholder="Recipient" onChange={this.onChangeHandler} value={this.state.newMsg.recipient} />
                    </Form.Group>
                    <Form.Group controlId="content">
                        <Form.Label>Content:</Form.Label>
                        <Form.Control type="text" placeholder="Content" onChange={this.onChangeHandler} value={this.state.newMsg.content} />
                    </Form.Group>
                    <Button variant="primary" onClick={this.sendNewMsg}>
                        Send
                    </Button>
                </Form>
                <p style={{ color: 'red' }}>{this.state.errMsg}</p>
            </React.Fragment>
        );

        let items = [];
        let num_pages = this.state.messages.length / 5;
        num_pages = this.state.messages.length % 5 == 0 ? num_pages : num_pages + 1;
        console.log("num pages:", num_pages);
        for (let number = 1; number <= num_pages; number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.active} onClick={() => this.onChangePageHandler(number)}>
                    {number}
                </Pagination.Item>,
            );
        }

        let inbox = (
            <React.Fragment>
                <h2>Inbox</h2>
                {this.state.messages
                    .filter((el, index) => {
                        return this.state.active * 5 - 5 <= index && this.state.active * 5 - 1 >= index;
                    })
                    .map(msg => {
                        return (
                            <Card style={{ marginTop: "20px" }} key={msg._id}>
                                <Card.Header>From: {msg.from}</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {msg.content}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                <br />
                {items.length > 0 ? (
                    <Pagination>{items}</Pagination>
                ) : null}
            </React.Fragment>
        )

        return (
            <React.Fragment>
                <h1>Messages</h1>
                <Container>
                    <Row>
                        <Button onClick={this.onInboxClickHandler}>Inbox</Button>
                        <Button style={{ marginLeft: 10 }} onClick={this.onNewMsgClickHandler}>New Message</Button>
                    </Row>
                    {this.state.sendMsg ? new_message : null}
                    {this.state.showInbox ? inbox : null}
                </Container>
            </React.Fragment>

        )
    }
}

export default Messages;