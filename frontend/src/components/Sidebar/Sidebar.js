import React, { Component } from 'react';
import './Sidebar.css';
import {NavLink, withRouter } from 'react-router-dom';
import { Nav,  Button } from 'react-bootstrap';
import TopicModal from './TopicModal';
import axios from 'axios';
import cookie from 'react-cookies';
import { user_tracking_apis} from '../../config'

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar_links: [],
//            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTY5NDg3NDksImlkIjoiNWNjOTMyN2VmMzYzOTMwMDAxZDkzMzIxIn0.1PyIZ9tVZCH9ihiF8KHTv8McvGlAwhBHor8GGPd7QKc'
            token: cookie.load('JWT')
        }
    }

    selectTopics = (e) => {
        e.preventDefault();
        this.setState({
            show_topics: true
        })
    }

    update_sidebar = (followed_topics) =>{
        this.setState({
            sidebar_links: followed_topics,
            show_topics: false
        })
    }

    componentDidMount() {
        //const sidebar_links = [
        //    { name: "Movies", url: "/topics/movies" },
        //    { name: "Food", url: "/topics/food" }
        // ];
        let header = {
  //          'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `JWT ${this.state.token}`
        }
        //axios.defaults.withCredentials = true;
        axios({
            medthod: 'get',
            url: user_tracking_apis + '/userFollow',
            headers: header
        })
            .then((res) => {
                if (res.status === 200) {
//                    console.log(res.data);
                    this.setState({
                        sidebar_links: res.data.followed_topics,
                    });
                }
                else if (res.status === 401) {
                    console.log('Token Error, please login again')
                }
            }).catch(err=>{
                console.log(err);
            })
    }

    render() {
        let sidebar_body = this.state.sidebar_links.map((link,idx) => {
            return (
                <Nav.Link key={idx} className="sidebar" as={NavLink} to={'/topics/' + link.label}>{link.label}</Nav.Link>
            )
        });
        let modal_T_Close = () => this.setState({ show_topics: false });
        return (
            <div>
                <TopicModal
                    show={this.state.show_topics}
                    onHide={modal_T_Close}
                    update_sidebar={this.update_sidebar}
                />
                <Nav style={{ "fontSize": 14, "lineHeight": 1.0 }} className="flex-column" >
                    {sidebar_body}
                </Nav>
                <Button style={{ 'textDecoration': 'none', "fontSize": 14, "lineHeight": 1.0,  'marginLeft': 8 }} variant="link" onClick={this.selectTopics}>Follow More</Button>
            </div>
        );
    }
}

export default withRouter(Sidebar);