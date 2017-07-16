import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppTheme from './constants/DesignApp.js';
import AppBar from 'material-ui/AppBar';
import LeftMenu from './components/LeftMenu';
import NavItems from './constants/LeftNavigationItems';
import { Route } from 'react-router-dom';
import './App.css';

const Elements = () =>
  <div>
    <h2>Elements</h2>
  </div>;

const Timelines = () =>
  <div>
    <h2>Timelines</h2>
  </div>;

const Schedule = () =>
  <div>
    <h2>Schedule</h2>
  </div>;

const Television = () =>
  <div>
    <h2>Television</h2>
  </div>;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    const contentStyle = {
      marginLeft: 80,
      transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)',
    };

    if (this.state.open) {
      contentStyle.marginLeft = 210;
    }

    return (
      <MuiThemeProvider muiTheme={AppTheme}>
        <div>
          {/* TOP BAR */}
          <AppBar
            title="Etix TV Manager"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggle}
          />

          {/* LEFT MENU */}
          <LeftMenu open={this.state.open} menuItems={NavItems} />

          {/* MAIN CONTENT */}
          <div style={contentStyle}>
            <Route exact path="/" component={Elements} />
            <Route path="/timelines" component={Timelines} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/tv" component={Television} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
