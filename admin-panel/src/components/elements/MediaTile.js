import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentAdd from 'material-ui/svg-icons/content/add';
import InlineInputEdit from '../shared/InlineInputEdit';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AppTheme from '../../constants/DesignApp.js';
import './MediaTile.css';
import VideoPng from './video.png';

const BASE_URL = process.env.REACT_APP_STATIC_URL;

// Helper

const getExt = name => {
  var arr = name.split('.');
  return arr[arr.length - 1];
};

const formatName = name => {
  var arr = name.split('/');
  return arr[arr.length - 1];
};

// Main

export default class MediaTile extends Component {
  render() {
    var items = [...this.props.item.menuItems];
    if (!this.props.item.isRoot) {
      items.push('..');
    }
    items = items.map(menuItem => {
      return (
        <MenuItem
          key={menuItem}
          primaryText={menuItem}
          onTouchTap={event => {
            this.props.item.onMenuSelection(this.props.item.name, menuItem);
          }}
        />
      );
    });

    return (
      <Paper style={sContainer} zDepth={2}>
        <FloatingActionButton
          mini={true}
          color={AppTheme.palette.primary3Color}
          style={sDeleteButton}
          onTouchTap={event => {
            this.props.item.onRemove(this.props.item.name);
          }}
        >
          <ContentClear />
        </FloatingActionButton>
        <FloatingActionButton
          mini={true}
          color={AppTheme.palette.primary3Color}
          style={sAddButton}
          onTouchTap={event => {
            this.props.item.onAdd(this.props.item.name);
          }}
        >
          <ContentAdd />
        </FloatingActionButton>
        <IconMenu
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          children={items}
          style={sFolderMenu}
        />
        <img
          src={getExt(this.props.item.name) === 'mp4' ? VideoPng : BASE_URL + this.props.item.name}
          alt={this.props.item.name}
          style={sContentImage}
        />
        <div style={sCaption}>
          <InlineInputEdit
            text={formatName(this.props.item.name)}
            onChange={this.props.item.onTextChange}
          />
        </div>
      </Paper>
    );
  }
}

// Inline style

const sContainer = {
  width: 160,
  height: 160,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  background: 'white',
};

const sContentImage = {
  maxWidth: '100%',
  height: 'auto',
  maxHeight: 105,
  right: 'auto',
  left: 'auto',
  margin: 'auto',
};

const sCaption = {
  width: 120,
  height: 35,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginTop: 'auto',
  marginLeft: 40,
};

const sDeleteButton = {
  position: 'fixed',
  top: 0,
  right: 0,
};

const sAddButton = {
  position: 'fixed',
  top: 0,
  left: 0,
};

const sFolderMenu = {
  position: 'fixed',
  bottom: 0,
  left: 0,
};
