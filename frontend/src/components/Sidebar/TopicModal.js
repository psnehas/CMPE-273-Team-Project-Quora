import { Modal, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import axios from 'axios';
import _ from "lodash";
import {david_test_apis, user_tracking_apis} from '../../config';
import cookie from 'react-cookies';

class TopicModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTopics: [],
      options: [],
      token: cookie.load('JWT')
    }
    this.handlePost = this.handlePost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.name, e.target.value);
  }

  handlePost = (e) => {
    e.preventDefault();
    const ids = this.state.selectedTopics.map(topic => 
        topic.label
    );
    console.log(ids);
    const data = {
      action: 'topic',
      ids: ids,
      unfollow: false
    }
    console.log(data);

    axios.post(user_tracking_apis + '/userFollow', data, {
      headers: {
        'Authorization': `JWT ${this.state.token}`
      }
    }).then(response => {
       this.props.update_sidebar(response.data.followed_topics);
    }).catch(error => {
      console.log(error);
    }); 

  }

  componentDidMount() {

  }

  handleSelectChange = (value, { action }) => {
    console.log(value, action);
    this.setState({
      selectedTopics: value
    })
  };


  getOptions = inputValue => {
    return axios.get(david_test_apis + '/topics', {
      headers: {
        'Authorization': `JWT ${this.state.token}`
      },
      params: {
        excludeFollowed: true
       }
     })
      .then(response => {
        //console.log(response.data);
        //     this.setState({
        //       options: response.data
        //     })
        return response.data
      }).then(options => {
        const filtered = _.filter(options, o =>
          _.startsWith(_.toLower(o.label), _.toLower(inputValue))
        );
        return filtered.slice(0, 10);
      })
  }

  render() {

    //  const { selectedOption } = this.state;

    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            What are your interests?
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label className="text-muted">Select topics you want to follow</Form.Label>
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={inputValue => this.getOptions(inputValue)}
                onChange={this.handleSelectChange}
                getOptionValue={option => option.label}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ 'color': '#949494', 'text-decoration': 'none', 'fontWeight': 400}} variant="link" onClick={this.props.onHide}>Not now</Button>
          <Button onClick={this.handlePost}>Done</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
// apply above mapping to Login class
export default TopicModal