import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const fakeGroups = ['entry', 'first-floor', 'second-floor', 'third-floor'];

// API Requests

const GetAllTelevisions = () => {
  return window.httpClient.get('/televisions');
};

const CreateTelevision = (name, ip) => {
  const data = new FormData();
  data.append('name', name);
  data.append('ip', ip);

  return window.httpClient.post('/television', data);
};

// Row Component

const Row = props => {
  const groups = fakeGroups.map((i, key) => {
    return <MenuItem key={key} value={key} primaryText={i} />;
  });

  return (
    <TableRow>
      <TableRowColumn>
        {props.name}
      </TableRowColumn>
      <TableRowColumn>
        {props.ip}
      </TableRowColumn>
      <TableRowColumn>
        <SelectField floatingLabelText="Group" value={props.group} children={groups} />
      </TableRowColumn>
    </TableRow>
  );
};

export default class TelevisionsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      televisions: [],
      creationName: '',
      creationIp: '',
    };
  }

  componentWillMount = () => {
    this.refreshTelevisions();
  };

  refreshTelevisions = () => {
    GetAllTelevisions()
      .then(response => {
        this.setState(state => {
          return { televisions: response.data };
        });
      })
      .catch(error => {
        console.log('Get all televisions failed: ', error);
      });
  };

  createTv = () => {
    CreateTelevision(this.state.creationName, this.state.creationIp)
      .then(response => {
        this.refreshTelevisions();
        this.setState(state => {
          return { creationName: '', creationIp: '' };
        });
      })
      .catch(error => {
        console.log('Create television failed: ', error);
      });
  };

  updateCreationName = (event, value) => {
    this.setState(state => {
      return { creationName: value };
    });
  };

  updateCreationIp = (event, value) => {
    this.setState(state => {
      return { creationIp: value };
    });
  };

  render() {
    const rows = this.state.televisions.map(i => {
      return Row(i);
    });

    return (
      <div>
        <div style={sFormAddTv}>
          <TextField
            onChange={this.updateCreationName}
            name={'newTvName'}
            floatingLabelText={'Name'}
            value={this.state.creationName}
          />
          <TextField
            onChange={this.updateCreationIp}
            name={'newTvIp'}
            floatingLabelText={'Ip'}
            value={this.state.creationIp}
          />
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <RaisedButton label="Create" onTouchTap={this.createTv} />
          </div>
        </div>
        <Divider />
        <div>
          <Table selectable={false}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>IP</TableHeaderColumn>
                <TableHeaderColumn>Group</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody children={rows} />
          </Table>
        </div>
      </div>
    );
  }
}

// Inline styles

const sFormAddTv = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};
