import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

export default class InputTextDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  handleChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const actions = [
      <FlatButton
        label={this.props.actionName}
        primary={true}
        onTouchTap={() => {
          this.props.onAction(this.state.value);
          this.setState(state => {
            return { value: '' };
          });
        }}
      />,
    ];

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        open={this.props.open}
        keyboardFocused={true}
      >
        <TextField
          floatingLabelText="Folder name"
          value={this.state.value}
          onChange={this.handleChange}
          errorText={this.props.error}
          onKeyPress={ev => {
            if (ev.key === 'Enter') {
              this.props.onAction(this.state.value);
              ev.preventDefault();
            }
          }}
        />
      </Dialog>
    );
  }
}
