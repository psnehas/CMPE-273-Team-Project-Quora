import { Modal, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import axios from 'axios';
import _ from "lodash";
import {david_test_apis, backend_host} from '../../config';
import cookie from 'react-cookies';

class AddQModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: this.props.user_name,
      selectedTopics: [],
      options: [],
      questionText: '',
      token: cookie.load('JWT'),
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
    const data = {
      content: this.state.questionText,
      topics: this.state.selectedTopics
    }
    console.log(data);

    axios.post(backend_host + '/addQuestion', data, {
      headers: {
        'Authorization': `Bearer ${this.state.token}`
      }
    }).then(response => {
     // console.log(response.data)
      this.props.afteradd();
    })

  }

  componentDidMount(){

  }

  handleSelectChange = (value, { action }) => {
    console.log(value, action);
    this.setState({
      selectedTopics: value
    })
  };


 getOptions = inputValue => {
   return axios.get(backend_host + '/topics', {
    headers: {
      'Authorization': `Bearer ${this.state.token}`
    },
     params: {
      exclude: false
     }
   })
   .then(response=>{
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
            Add Question
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>{this.state.user_name} asked</Form.Label>
              <Form.Text className="text-muted">
                Start your question with "What", "How", "Why", etc.
              </Form.Text>
              <Form.Control as="textarea" rows="3" name="questionText" onChange={this.handleChange} />
              <Form.Text className="text-muted">
                Select topics you want to post question to
              </Form.Text>
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={inputValue => this.getOptions(inputValue)}
                onChange={this.handleSelectChange}
                getOptionValue={option => option._id}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={this.props.onHide}>Cancel</Button>
          <Button onClick={this.handlePost}>Add Question</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
// apply above mapping to Login class
export default AddQModal