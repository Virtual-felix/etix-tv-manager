import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import moment from 'moment';

// API Requests;

const GetAllTelevisions = () => {
  return window.httpClient.get('/televisions');
};

const GetAllTimelines = () => {
  return window.httpClient.get('/timeline');
};

const GetPlanifications = tvid => {
  return window.httpClient.get('/planifications/' + tvid);
};

const CreatePlanification = (tvid, tiid, startAt, endAt) => {
  const fmtStart = moment(startAt);
  const fmtEnd = moment(endAt);

  const data = new FormData();
  data.append('tvid', tvid);
  data.append('tiid', tiid);
  data.append('startat', fmtStart.unix());
  data.append('endat', fmtEnd.unix());

  return window.httpClient.post('/planification', data);
};

const UpdatePlanification = (id, tvid, tiid, startAt, endAt) => {
  const fmtStart = moment(startAt);
  const fmtEnd = moment(endAt);

  const data = new FormData();
  data.append('tvid', tvid);
  data.append('tiid', tiid);
  data.append('startat', fmtStart.unix());
  data.append('endat', fmtEnd.unix());

  return window.httpClient.put('/planification/' + id, data);
};

const DeletePlanification = id => {
  console.log(id);
  return window.httpClient.delete('planification/' + id);
};

// Helper

const formatDate = date => {
  return moment(date).format('MMMM Do YYYY');
};

// Row Component

const Row = props => {
  const start = moment(props.start).format('MMMM Do YYYY, h:mm a');
  const end = moment(props.end).format('MMMM Do YYYY, h:mm a');

  return (
    <TableRow>
      <TableRowColumn>
        {props.name}
      </TableRowColumn>
      <TableRowColumn>
        {start}
      </TableRowColumn>
      <TableRowColumn>
        {end}
      </TableRowColumn>
      <TableRowColumn>
        <RaisedButton
          label="Delete"
          secondary={true}
          onTouchTap={() => {
            props.onDelete(props.id);
          }}
        />
        <RaisedButton
          label="Save"
          onTouchTap={() => {
            props.onUpdate(props.id);
          }}
        />
      </TableRowColumn>
    </TableRow>
  );
};

// Main

export default class SchedulesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      televisions: [],
      selectedTelevision: 0,
      timelines: [],
      selectedTimeline: 0,
      planifications: [],
      startAt: undefined,
      endAt: undefined,
    };
  }

  componentWillMount = () => {
    this.refreshTelevisions();
    this.refreshTimelines();
    this.refreshPlanifications();
  };

  refreshTelevisions = () => {
    GetAllTelevisions()
      .then(response => {
        this.setState(state => {
          return { televisions: response.data };
        }, this.refreshPlanifications);
      })
      .catch(error => {
        console.log('Get all televisions failed: ', error);
      });
  };

  refreshTimelines = () => {
    GetAllTimelines()
      .then(response => {
        this.setState(state => {
          return { timelines: response.data };
        }, this.refreshTimelineItems);
      })
      .catch(error => {
        console.log('Get all timelines: ', error);
      });
  };

  refreshPlanifications = () => {
    if (this.state.televisions.length === 0) {
      return;
    }
    GetPlanifications(this.state.televisions[this.state.selectedTelevision].id).then(response => {
      this.setState(state => {
        return { planifications: response.data };
      });
    });
  };

  handleTelevisionSelection = (e, key, payload) => {
    this.setState(state => {
      return { selectedTelevision: key };
    }, this.refreshPlanifications);
  };

  handleTimelineSelection = (e, key, payload) => {
    this.setState(state => {
      return { selectedTimeline: key };
    });
  };

  handleStartDateSelection = (e, date) => {
    this.setState(
      state => {
        return { startAt: date };
      },
      () => {
        this.refs.timepickerstart.openDialog();
      },
    );
  };
  handleStartTimeSelection = (e, time) => {
    this.setState(state => {
      return { startAt: time };
    });
  };

  handleEndDateSelection = (e, date) => {
    this.setState(
      state => {
        return { endAt: date };
      },
      () => {
        this.refs.timepickerend.openDialog();
      },
    );
  };
  handleEndTimeSelection = (e, time) => {
    this.setState(state => {
      return { endAt: time };
    });
  };

  createPlanification = () => {
    const tv = this.state.televisions[this.state.selectedTelevision];
    const timeline = this.state.timelines[this.state.selectedTimeline];
    CreatePlanification(tv.id, timeline.id, this.state.startAt, this.state.endAt)
      .then(response => {
        this.refreshPlanifications();
      })
      .catch(error => {
        console.log('Create planification failed: ', error);
      });
  };

  deletePlanification = id => {
    DeletePlanification(id)
      .then(response => {
        this.refreshPlanifications();
      })
      .catch(error => {
        console.log('Delete planification failed: ', error);
      });
  };

  updatePlanification = id => {
    const tv = this.state.televisions[this.state.selectedTelevision];
    const timeline = this.state.timelines[this.state.selectedTimeline];
    UpdatePlanification(id, tv.id, timeline.id, this.state.startAt, this.state.endAt)
      .then(response => {
        this.refreshPlanifications();
      })
      .catch(error => {
        console.log('Update planification failed: ', error);
      });
  };

  render() {
    const televisions = this.state.televisions.map((i, key) => {
      return <MenuItem value={i.name} key={key} primaryText={i.name} />;
    });

    const timelines = this.state.timelines.map((i, key) => {
      return <MenuItem value={i.name} key={key} primaryText={i.name} />;
    });

    const rows = this.state.planifications.map(i => {
      return Row({
        name: i.tiid,
        start: i.startAt,
        end: i.endAt,
        id: i.id,
        onDelete: this.deletePlanification,
        onUpdate: this.updatePlanification,
      });
    });

    return (
      <div>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <SelectField
              floatingLabelText="Television"
              value={
                this.state.televisions.length > 0
                  ? this.state.televisions[this.state.selectedTelevision].name
                  : ''
              }
              onChange={this.handleTelevisionSelection}
              children={televisions}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <DatePicker
                autoOk={true}
                onChange={this.handleStartDateSelection}
                hintText="Starting date"
                value={this.state.startAt}
                formatDate={formatDate}
              />
              <TimePicker
                ref="timepickerstart"
                style={{ display: 'none' }}
                onChange={this.handleStartTimeSelection}
                name={'time'}
                value={this.state.startAt}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <DatePicker
                autoOk={true}
                onChange={this.handleEndDateSelection}
                hintText="Ending date"
                value={this.state.endAt}
                formatDate={formatDate}
              />
              <TimePicker
                ref="timepickerend"
                style={{ display: 'none' }}
                onChange={this.handleEndTimeSelection}
                name={'time'}
                value={this.state.endAt}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <SelectField
              floatingLabelText="Timeline"
              value={
                this.state.timelines.length > 0
                  ? this.state.timelines[this.state.selectedTimeline].name
                  : ''
              }
              onChange={this.handleTimelineSelection}
              children={timelines}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: 10 }}>
            <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <RaisedButton label="Create" onTouchTap={this.createPlanification} />
            </div>
          </div>
          <Divider />
        </div>
        <div>
          <Table selectable={false}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Timeline</TableHeaderColumn>
                <TableHeaderColumn>Start at</TableHeaderColumn>
                <TableHeaderColumn>End at</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody children={rows} />
          </Table>
        </div>
      </div>
    );
  }
}
