import React, { Component } from 'react';
import RichTextEditor from 'react-rte';
import PropTypes from 'prop-types';

export default class AnswerEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    let value = RichTextEditor.createEmptyValue();
    if (this.props.value){
      value = RichTextEditor.createValueFromString(this.props.value, 'html');
    }
    this.state = {
      value: value
      //  value: RichTextEditor.createEmptyValue()
 //     value: RichTextEditor.createValueFromString(this.props.value, 'html')
   }
  }
  onChange = (value) => {

    console.log(value);
    this.setState({ value });

    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
  };

  render() {
    return (
      <RichTextEditor
        value={this.state.value}
        onChange={this.onChange}
        placeholder="Write your answer"
      />
    );
  }
}