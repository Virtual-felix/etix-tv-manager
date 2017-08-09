import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import AppTheme from '../../constants/DesignApp.js';

export default class MediaFolder extends Component {
  render() {
    return (
      <Paper
        style={sContainer}
        zDepth={2}
        onDoubleClick={event => {
          this.props.item.onDoubleClick(this.props.item);
        }}
      >
        <FontIcon className="material-icons" style={sIcons}>
          folder
        </FontIcon>
        <div>
          {this.props.item.name}
        </div>
      </Paper>
    );
  }
}

// Inline styles

const sContainer = {
  width: 160,
  height: 40,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'flex-start',
  background: 'white',
  paddingTop: 10,
};

const sIcons = {
  marginRight: 15,
  marginLeft: 10,
  color: AppTheme.palette.primary4Color,
};
