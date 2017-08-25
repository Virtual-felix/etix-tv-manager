import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// API Requests

const Login = (login, password) => {
  const data = new FormData();
  data.append('username', login);
  data.append('password', password);

  return window.httpClient.post('/login', data);
};

// Main

export default class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
    };
  }

  login = () => {
    Login(this.state.login, this.state.password)
      .then(response => {
        this.setState(state => {
          return { errorText: '' };
        });
        sessionStorage.setItem('token', response.data.token);
        window.location.replace('/');
      })
      .catch(error => {
        this.setState(state => {
          return { errorText: 'Login failed. Bad username or password.' };
        });
        console.log('Authentification failed: ', error);
      });
  };

  updateLogin = (e, value) => {
    this.setState(state => {
      return { login: value };
    });
  };

  updatePassword = (e, value) => {
    this.setState(state => {
      return { password: value };
    });
  };

  render() {
    return (
      <div style={sContainer}>
        <div />
        <div style={sForm}>
          <div>
            <TextField
              onChange={this.updateLogin}
              name={'Login'}
              floatingLabelText={'Login'}
              value={this.state.login}
              errorText={this.state.errorText}
            />
          </div>
          <div style={{ height: 20 }} />
          <div>
            <TextField
              onChange={this.updatePassword}
              name={'Password'}
              floatingLabelText={'Password'}
              value={this.state.password}
              type="password"
            />
          </div>
          <div style={{ height: 20 }} />
          <div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
              <div />
              <div>
                <RaisedButton label="Connect" onTouchTap={this.login} />
              </div>
              <div />
            </div>
          </div>
        </div>
        <div />
      </div>
    );
  }
}

// Inline styles

const sContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  minHeight: '60vh',
};

const sForm = {
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
};
