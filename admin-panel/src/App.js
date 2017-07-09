
import React, { Component } from 'react';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import NavItems from './constants/navigation'
import logo from './logo-mini.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { key: NavItems[0].key }
    this._setActive = this._setActive.bind(this);
    this._navItems = NavItems.map(item => {
      if (!item.divider) {
        item.onClick = () => this._setActive(item.key);
      }
      return item;
    });
  }

  _setActive(key) {
    this._navItems = this._navItems.map(item => {
      if (!item.divider) {
        item.active = item.key === key;
      }
      return item;
    });

    this.setState({ key });
  }

  render() {
    return (
      <NavigationDrawer
        drawerHeaderChildren={<img src={logo} className="App-logo" alt="logo" />}
        toolbarTitle="Etix TV Manager"
        navItems={this._navItems}
        mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
        tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
        desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
        // toolbarProminentTitle
        contentId="main-layout"
      >
        <div key="pouet" className="App">
          Here the content will be.
        </div>
      </NavigationDrawer>
    );
  }
}

export default App;
