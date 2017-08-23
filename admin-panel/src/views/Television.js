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

// API Requests

const GetAllTelevisions = () => {
  return window.httpClient.get('/restricted/televisions');
};

const CreateTelevision = (name, ip) => {
  const data = new FormData();
  data.append('name', name);
  data.append('ip', ip);

  return window.httpClient.post('/restricted/television', data);
};

const UpdateTelevision = (id, name, ip, gid) => {
  const data = new FormData();
  data.append('name', name);
  data.append('ip', ip);
  data.append('gid', gid);

  return window.httpClient.put('/restricted/television/' + id, data);
};

const GetAllGroups = () => {
  return window.httpClient.get('/restricted/television/groups');
};

const CreateGroup = name => {
  const data = new FormData();
  data.append('name', name);

  return window.httpClient.post('/restricted/television/group', data);
};

// Row Component

const Row = props => {
  const groups = props.groups.map((i, key) => {
    return <MenuItem key={i.id} value={i.id} primaryText={i.name} />;
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
        <SelectField
          floatingLabelText="Group"
          value={props.gid}
          children={groups}
          onChange={(e, key, payload) => {
            props.onUpdate(props.id, props.name, props.ip, props.groups[key].id);
          }}
        />
      </TableRowColumn>
    </TableRow>
  );
};

export default class TelevisionsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      televisions: [],
      groups: [],
      creationName: '',
      creationGroupName: '',
      creationIp: '',
    };
  }

  componentWillMount = () => {
    this.refreshTelevisions();
    this.refreshGroups();
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

  refreshGroups = () => {
    GetAllGroups()
      .then(response => {
        this.setState(state => {
          return { groups: response.data };
        });
      })
      .catch(error => {
        console.log('Get all groups failed: ', error);
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

  updateTv = (id, name, ip, gid) => {
    UpdateTelevision(id, name, ip, gid)
      .then(response => {
        this.refreshTelevisions();
      })
      .catch(error => {
        console.log('Update television failed: ', error);
      });
  };

  createGroup = () => {
    CreateGroup(this.state.creationGroupName)
      .then(response => {
        this.refreshGroups();
        this.setState(state => {
          return { creationGroupName: '' };
        });
      })
      .catch(error => {
        console.log('Create group failed: ', error);
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

  updateCreationGroupName = (event, value) => {
    this.setState(state => {
      return { creationGroupName: value };
    });
  };

  render() {
    const rows = this.state.televisions.map(i => {
      i.groups = this.state.groups;
      i.onUpdate = this.updateTv;
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
          <TextField
            onChange={this.updateCreationGroupName}
            name={'newTvGroupName'}
            floatingLabelText={'Groupe name'}
            value={this.state.creationGroupName}
          />
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <RaisedButton label="Create Group" onTouchTap={this.createGroup} />
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
