import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const style = {
  width: 160,
  height: 160,
  overflow: 'hidden',
};

const imgStyle = {
  maxWidth: '100%',
  height: 'auto',
  maxHeight: 100,
  right: 'auto',
  left: 'auto',
};

const nameStyle = {
  width: '100%',
  height: 60,
  overflow: 'hidden',
};

export default class MediaTile extends Component {
  render() {
    return (
      <Paper style={style} zDepth={2}>
        <FloatingActionButton
          mini={true}
          style={{ marginRight: 20, float: 'right', display: 'inline' }}
        >
          <ContentAdd />
        </FloatingActionButton>
        <img
          src={'http://127.0.0.1:8080/' + this.props.item.name}
          alt={this.props.item.name}
          style={imgStyle}
        />
        <Paper style={nameStyle}>
          <p>
            {this.props.item.name}
          </p>
        </Paper>
      </Paper>
    );
  }
}
