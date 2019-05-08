import React, { Component } from 'react';
import { Container, Col, Row, ListGroup, Modal, Button, Form } from 'react-bootstrap';
import cookie from 'react-cookies';
import { backend_host } from '../../config';
import moment from 'moment';
import axios from 'axios';
import renderHTML from 'react-render-html';
import { Link } from 'react-router-dom';

var html_truncate = require('html-truncate');

const new_first_sort = (a, b) => {
    return moment.utc(b.time).diff(moment.utc(a.time))
}

const old_first_sort = (a, b) => {
    return moment.utc(a.time).diff(moment.utc(b.time))
}

class ContentPage extends Component {

    state = {
        all: [],
        filter: "all",
        sort: "nf"
    }

    componentDidMount() {
        axios.get(`${backend_host}/activities`, {
            headers: {
                'Authorization': `Bearer ${cookie.load('JWT')}`
            }
        }).then(res => {
            let context = res.data.activities.map(d => {
                let ret = {};
                ret.action = d.action;
                ret.content = d.obj.content;
                ret.time = d.time;
                if (d.onObj === "Answer") {
                    ret.id = d.obj.question_id
                } else if (d.onObj === "Question") {
                    ret.id = d.obj._id
                }
                return ret;
            });
            // Sort by date
            context.sort(new_first_sort)

            this.setState({
                all: context
            })

        })
    }

    onChangeFilterHandler = (filter) => {
        this.setState({
            filter
        })
    }

    onSortHandler = (sort) => {
        this.setState({
            sort
        })
    }

    render() {

        let data_to_render = [];

        if (this.state.filter === 'all') data_to_render = this.state.all;
        else if (this.state.filter === 'qa') data_to_render = this.state.all.filter(d => d.action === 'question_asked');
        else if (this.state.filter === 'af') data_to_render = this.state.all.filter(d => d.action === 'question_followed');
        else if (this.state.filter === 'a') data_to_render = this.state.all.filter(d => d.action === 'answer');

        if (this.state.sort === 'nf') data_to_render.sort(new_first_sort);
        else if (this.state.sort === 'of') data_to_render.sort(old_first_sort);

        console.log(data_to_render)

        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <h3 className="ml-auto mr-auto">Content Page</h3>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <h5>Filter</h5>
                            <ListGroup defaultActiveKey="all">
                                <ListGroup.Item action eventKey="all" onClick={() => this.onChangeFilterHandler("all")}>
                                    All
                                </ListGroup.Item>
                                <ListGroup.Item action eventKey="qa" onClick={() => this.onChangeFilterHandler("qa")}>
                                    Questions Asked
                                </ListGroup.Item>
                                <ListGroup.Item action eventKey="qf" onClick={() => this.onChangeFilterHandler("qf")}>
                                    Questions Followed
                                </ListGroup.Item>
                                <ListGroup.Item action eventKey="a" onClick={() => this.onChangeFilterHandler("a")}>
                                    Answers
                                </ListGroup.Item>
                            </ListGroup>
                            <hr />
                            <h5>Sort</h5>
                            <ListGroup defaultActiveKey="nf">
                                <ListGroup.Item action eventKey="nf" onClick={() => this.onSortHandler("nf")}>
                                    Newest First
                                </ListGroup.Item>
                                <ListGroup.Item action eventKey="of" onClick={() => this.onSortHandler("of")}>
                                    Oldest First
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col>
                            <ListGroup>
                                {data_to_render.map(d => {
                                    return <ListGroup.Item key={`${d.id}${d.time}`}>
                                                <Link to={`/questions/${d.id}`}>{renderHTML(html_truncate(d.content, 20))}</Link>
                                    </ListGroup.Item>
                                })}
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default ContentPage;