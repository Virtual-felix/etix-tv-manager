import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const style = {
  width: 160,
  height: 160,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  background: 'white',
};

const imgStyle = {
  maxWidth: '100%',
  height: 'auto',
  maxHeight: 100,
  right: 'auto',
  left: 'auto',
  margin: 'auto',
};

const captionStyle = {
  width: '100%',
  height: 60,
  overflow: 'hidden',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginTop: 'auto',
};

const removeButtonStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
};

export default class MediaTile extends Component {
  removeTile = tile => {
    const data = new FormData();
    data.append('name', this.props.item.name);

    window.httpClient
      .put('/media', data)
      .then(response => {
        this.props.onRemove(true, response);
      })
      .catch(error => {
        this.props.onRemove(false, error);
      });
  };

  render() {
    return (
      <Paper style={style} zDepth={2}>
        <FloatingActionButton mini={true} style={removeButtonStyle} onTouchTap={this.removeTile}>
          <ContentAdd />
        </FloatingActionButton>
        <img
          src={'http://127.0.0.1:8080/' + this.props.item.name}
          alt={this.props.item.name}
          style={imgStyle}
        />
        <div style={captionStyle}>
          {this.props.item.name}
        </div>
      </Paper>
    );
  }
}
