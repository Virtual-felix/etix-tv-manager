import React, { Component } from 'react';
import { GridList } from 'material-ui/GridList';
import TimelineTile from './TimelineTile';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

const categories = ['Welcome', 'Etix Officies', 'Etix Labs', 'Events', 'News'];

// API Requests

const CreateTimeline = name => {
  const data = new FormData();
  data.append('name', name);

  return window.httpClient.post('/timeline', data);
};

const UpdateTimeline = (id, name, summary) => {
  const data = new FormData();
  data.append('name', name);
  data.append('summary', summary);

  return window.httpClient.put('/timeline/' + id, data);
};

const UpdateTimelineItem = (name, category, time, index, id, tid) => {
  const data = new FormData();
  data.append('name', name);
  data.append('time', time);
  data.append('category', category);
  data.append('index', index);
  data.append('tid', tid);

  return window.httpClient.put('/timeline/item/' + id, data);
};

const DeleteTimelineItem = id => {
  return window.httpClient.delete('timeline/item/' + id);
};

// Main

export default class TimelineCreationArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creationName: '',
    };
  }

  createTimeline = () => {
    CreateTimeline(this.state.creationName)
      .then(response => {
        this.setState(state => {
          return { creationName: '' };
        });
        this.props.onTimelineCreation();
      })
      .catch(error => {
        console.log('Create timeline: ', error);
      });
  };

  updateTimeline = (event, summary) => {
    UpdateTimeline(
      this.props.timelines[this.props.selectedTimeline].id,
      this.props.timelines[this.props.selectedTimeline].name,
      summary,
    )
      .then(response => {
        this.props.onUpdate();
      })
      .catch(error => {
        console.log('Update timeline failed: ', error);
      });
  };

  updateTimelineItem = (name, category, time, index, id, tid) => {
    UpdateTimelineItem(name, category, time, index, id, tid)
      .then(responsible => {
        this.props.onUpdateItems();
      })
      .catch(error => {
        console.log('Update timeline item: ', error);
      });
  };

  handleTimelineSelection = (event, key, payload) => {
    this.props.onTimelineSelection(key);
  };

  updateNewTimelineName = (event, value) => {
    this.setState(state => {
      return { creationName: value };
    });
  };

  deleteTimelineItem = id => {
    DeleteTimelineItem(id)
      .then(response => {
        this.props.onUpdateItems();
      })
      .catch(error => {
        console.log('Delete timeline item:', error);
      });
  };

  onMoveLeftTile = item => {
    const leftItem = this.props.items[item.index - 1];
    this.updateTimelineItem(item.name, item.category, item.time, item.index - 1, item.id, item.tid);
    this.updateTimelineItem(
      leftItem.name,
      leftItem.category,
      leftItem.time,
      item.index,
      leftItem.id,
      leftItem.tid,
    );
  };

  onMoveRightTile = item => {
    const rightItem = this.props.items[item.index + 1];
    this.updateTimelineItem(item.name, item.category, item.time, item.index + 1, item.id, item.tid);
    this.updateTimelineItem(
      rightItem.name,
      rightItem.category,
      rightItem.time,
      item.index,
      rightItem.id,
      rightItem.tid,
    );
  };

  render() {
    const tiles = this.props.items.map((i, ind) => {
      return (
        <TimelineTile
          categories={categories}
          item={i}
          index={ind}
          onUpdate={this.updateTimelineItem}
          onDelete={this.deleteTimelineItem}
          onMoveLeft={this.onMoveLeftTile}
          onMoveRight={this.onMoveRightTile}
        />
      );
    });

    const timelines = this.props.timelines.map((i, key) => {
      return <MenuItem value={i.name} key={key} primaryText={i.name} />;
    });

    return (
      <Paper style={sContainer}>
        <div style={sOptions}>
          <SelectField
            floatingLabelText="Timeline"
            value={
              this.props.timelines.length > 0
                ? this.props.timelines[this.props.selectedTimeline].name
                : ''
            }
            onChange={this.handleTimelineSelection}
            children={timelines}
          />
          <TextField
            onChange={this.updateNewTimelineName}
            name={'newTimelineName'}
            floatingLabelText={'Timeline name'}
            value={this.state.creationName}
          />
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <RaisedButton label="Create" onTouchTap={this.createTimeline} />
          </div>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <Checkbox
              checked={
                this.props.timelines.length > 0
                  ? this.props.timelines[this.props.selectedTimeline].summary
                  : false
              }
              label="Summary"
              onCheck={this.updateTimeline}
            />
          </div>
        </div>
        <Divider />
        <div style={sTimelineGridContainer}>
          <GridList style={sTimelineGrid} cellHeight={'auto'} children={tiles} />
        </div>
      </Paper>
    );
  }
}

// Inline style

const sContainer = {
  width: '100%',
  height: 'auto',
  position: 'fixed',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
};

const sOptions = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};

const sTimelineGridContainer = {
  background: 'grey',
  display: 'flex',
  flexWrap: 'wrap',
  minHeight: 50,
};

const sTimelineGrid = {
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
};
