import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router-dom';

const SelectableList = makeSelectable(List);

function MenuItem(props) {
  return (
    <ListItem
      primaryText={props.label}
      value={props.index}
      containerElement={<Link to={props.to} />}
      rightIcon={
        <FontIcon
          className="material-icons"
          style={{
            marginRight: 20,
          }}
        >
          {props.icon}
        </FontIcon>
      }
      key={props.to}
    />
  );
}

export default class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this._menuItems = props.menuItems.map(item => MenuItem(item));
    this.state = { open: props.open, selectedItem: 1 };
  }

  changeActiveItem = (event, index) => {
    this.setState({
      selectedItem: index,
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  render() {
    return (
      <Drawer containerStyle={{ top: 64, width: 200 }} width={120} open={this.state.open}>
        <SelectableList
          value={this.state.selectedItem}
          onChange={this.changeActiveItem}
          children={this._menuItems}
        />
      </Drawer>
    );
  }
}
