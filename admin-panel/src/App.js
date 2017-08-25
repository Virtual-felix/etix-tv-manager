import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppTheme from './constants/DesignApp.js';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import LeftMenu from './components/LeftMenu';
import NavItems from './constants/LeftNavigationItems';
import FilesView from './views/Files';
import TelevisionsView from './views/Television';
import SchedulesView from './views/Schedules';
import LoginView from './views/Login';

import { Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  disconnect = () => {
    sessionStorage.setItem('token', undefined);
    window.location.replace('/login');
  };

  render() {
    const contentStyle = {
      marginLeft: 70,
      transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)',
    };

    if (this.state.open) {
      contentStyle.marginLeft = 200;
    }

    return (
      <MuiThemeProvider muiTheme={AppTheme}>
        <div>
          {/* TOP BAR */}
          <AppBar
            title="Etix TV Manager"
            iconElementRight={
              <IconButton>
                <NavigationClose />
              </IconButton>
            }
            onLeftIconButtonTouchTap={this.handleToggle}
            onRightIconButtonTouchTap={this.disconnect}
          />

          {/* LEFT MENU */}
          <LeftMenu open={this.state.open} menuItems={NavItems} />

          {/* MAIN CONTENT */}
          <div style={contentStyle}>
            <Route exact path="/" component={FilesView} />
            <Route path="/schedule" component={SchedulesView} />
            <Route path="/tv" component={TelevisionsView} />
            <Route path="/login" component={LoginView} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
