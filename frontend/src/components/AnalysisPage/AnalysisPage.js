import React, { Component } from 'react';
import { Container, Row, Button, Form, Card, Pagination, Modal } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import cookie from 'react-cookies';
import axios from 'axios';
import { backend_host } from '../../config'
import renderHTML from 'react-render-html';

const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#6CCFF6',
    '#001011',
    '#757780',
    '#FFFFFC',
    '#98CE00',
    '#8E5572',
    '#C2B97F',
]

class AnalysisPage extends Component {

    state = {
        view_five_ans : {
            labels: [],
            datasets: []
        },
        up_five_ans : {
            labels: [],
            datasets: []
        },
        down_five_ans : {
            labels: [],
            datasets: []
        }
    }

    data = {
        labels: [
            'Red',
            'Green',
            'Yellow'
        ],
        datasets: [{
            data: [300, 50, 100],
            backgroundColor: colors,
            hoverBackgroundColor: colors
        }]
    }

    componentDidMount() {
        axios.get(`${backend_host}/stats`)
            .then(res => {
                console.log("stats", res.data)
                let top5DownvotesAnswers = res.data.top5DownvotesAnswers.map(d => {
                    return {
                        label: d.content,
                        data: d.downvote
                    }
                })
                let top5UpvotesAnswers = res.data.top5UpvotesAnswers.map(d => {
                    return {
                        label: d.content,
                        data: d.upvote
                    }
                })
                let top5ViewAnswers = res.data.top5ViewAnswers.map(d => {
                    return {
                        label: d.content,
                        data: d.view
                    }
                })

                let view_five_ans = {
                    labels: [
                        "Answer1",
                        "Answer2",
                        "Answer3",
                        "Answer4",
                        "Answer5"
                    ],
                    datasets: [{data: [], backgroundColor: colors,
            hoverBackgroundColor: colors}]
                }

                top5ViewAnswers.forEach(d => {
                    // view_five_ans.labels.push(d.label);
                    // view_five_ans.datasets.push(d.data);
                    view_five_ans.datasets[0].data.push(d.data);

                })

                let up_five_ans = {
                    labels: [
                        "Answer1",
                        "Answer2",
                        "Answer3",
                        "Answer4",
                        "Answer5"
                    ],
                    datasets: [{data: [], backgroundColor: colors,
            hoverBackgroundColor: colors}]
                }

                top5UpvotesAnswers.forEach(d => {
                    // up_five_ans.labels.push(d.label);
                    // up_five_ans.datasets.push(d.data);
                    up_five_ans.datasets[0].data.push(d.data);

                })

                let down_five_ans = {
                    labels: [
                        "Answer1",
                        "Answer2",
                        "Answer3",
                        "Answer4",
                        "Answer5"
                    ],
                    datasets: [{data: [], backgroundColor: colors,
            hoverBackgroundColor: colors}]
                }

                top5DownvotesAnswers.forEach(d => {
                    // down_five_ans.labels.push(d.label);
                    down_five_ans.datasets[0].data.push(d.data);
                })

                console.log(view_five_ans, up_five_ans, down_five_ans);
                // res.data.top5UpvotesAnswers
                // res.data.top5ViewAnswers

                this.setState({
                    view_five_ans,
                    up_five_ans,
                    down_five_ans
                })
            });
    }

    render() {
        return (
            <React.Fragment>
                <Container>
                    <Row>
                        <h3 className="ml-auto mr-auto">Stats Page</h3>
                    </Row>
                    <hr />
                    <Row>
                        <h5 className="ml-auto mr-auto">Views of Top 5 Answers</h5>
                        <Pie data={this.state.view_five_ans} />
                    </Row>
                    <hr />
                    <Row>
                        <h5 className="ml-auto mr-auto">Upvotes of Top 5 Answers</h5>
                        <Pie data={this.state.up_five_ans} />
                    </Row>
                    <hr />
                    <Row>
                        <h5 className="ml-auto mr-auto">Downvotes of Top 5 Answers</h5>
                        <Pie data={this.state.down_five_ans} />
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default AnalysisPage;