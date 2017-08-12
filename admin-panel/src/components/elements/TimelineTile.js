import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import HardwareLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import HardwareRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import AppTheme from '../../constants/DesignApp.js';

const BASE_URL = 'http://127.0.0.1:8080/';

export default class TimelineTile extends Component {
  handleCategorieChange = (event, key, payload) => {
    this.update(payload, this.props.item.time);
  };

  handleTimeChange = (event, value) => {
    this.update(this.props.item.category, value);
  };

  update = (category, time) => {
    this.props.onUpdate(
      this.props.item.name,
      category,
      time,
      this.props.item.index,
      this.props.item.id,
      this.props.item.tid,
    );
  };

  render() {
    // NOTE: C'est pas chelou de re-process ce mapping a chaque render alors que ca change pas ?
    const categoryItems = this.props.categories.map(i => {
      return <MenuItem value={i} key={i} primaryText={i} />;
    });

    return (
      <div style={sContainer}>
        <div style={sOptions}>
          <SelectField
            floatingLabelText="Category"
            value={this.props.item.category}
            onChange={this.handleCategorieChange}
            children={categoryItems}
            fullWidth={true}
          />
          <TextField
            value={this.props.item.time}
            onChange={this.handleTimeChange}
            name={this.props.item.name}
            floatingLabelText={'Seconds'}
            style={{ width: '30%' }}
          />
          <FloatingActionButton
            mini={true}
            color={AppTheme.palette.primary3Color}
            onTouchTap={event => {
              this.props.onDelete(this.props.item.id);
            }}
          >
            <ContentClear />
          </FloatingActionButton>
          <FloatingActionButton
            mini={true}
            color={AppTheme.palette.primary3Color}
            onTouchTap={event => {
              this.props.onMoveLeft(this.props.item);
            }}
          >
            <HardwareLeft />
          </FloatingActionButton>
          <FloatingActionButton
            mini={true}
            color={AppTheme.palette.primary3Color}
            onTouchTap={event => {
              this.props.onMoveRight(this.props.item);
            }}
          >
            <HardwareRight />
          </FloatingActionButton>
        </div>
        <Paper style={sCard}>
          <img
            src={BASE_URL + this.props.item.name}
            alt={this.props.item.name}
            style={sContentImage}
          />
          <div style={sCaption}>
            {this.props.item.name}
          </div>
        </Paper>
      </div>
    );
  }
}

// Inline styles

const sContainer = {
  background: 'white',
  width: 180,
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
};

const sOptions = {
  width: '100%',
};

const sCard = {
  width: 160,
  height: 160,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
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
