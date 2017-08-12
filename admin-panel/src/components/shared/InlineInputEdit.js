import React, { PureComponent } from 'react';
import { RIEInput } from 'riek';
import _ from 'lodash';

export default class InlineInputEdit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
    };
  }

  onChange = task => {
    let origin = this.state.text;
    this.props.onChange(origin, task.text);
    this.setState({ text: task.text });
  };

  render() {
    return (
      <RIEInput
        value={this.state.text}
        change={this.onChange}
        propName="text"
        validate={_.isString}
      />
    );
  }
}
