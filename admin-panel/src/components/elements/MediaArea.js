import React, { Component } from 'react';
import createAbosluteGrid from 'react-absolute-grid';
import MediaTile from './MediaTile';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import './MediaArea.css';

const style = {
  margin: 30,
};

const AbsoluteGrid = createAbosluteGrid(MediaTile);

export default class MediaArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaList: [],
      sort: 'sort',
    };
    this.refreshMediaList();
  }

  refreshMediaList = () => {
    window.httpClient
      .get('/media/list/')
      .then(response => {
        this.setState({ mediaList: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onRemoveTile = (success, response, item) => {
    if (success) {
      this.refreshMediaList();
    }
  };

  handleUpdateInput = value => {
    var search = new RegExp(value, 'i');
    const list = this.state.mediaList.map(function(item) {
      const isMatched = !item.name.match(search);
      if (!item.filtered || isMatched !== item.filtered) {
        return {
          ...item,
          filtered: isMatched,
        };
      }
      return item;
    });
    this.setState({ mediaList: list });
  };

  sortByName = () => this.setState({ sort: 'name' });
  sortBySize = () => this.setState({ sort: 'size' });
  sortByDate = () => this.setState({ sort: 'lastmodified' });

  render() {
    const list = this.state.mediaList;
    list.map(item => {
      item.onRemove = this.onRemoveTile;
      return item;
    });

    return (
      <div style={style}>
        <div>
          <RaisedButton
            label="Names"
            primary={true}
            className={'sortButton'}
            onTouchTap={this.sortByName}
          />
          <RaisedButton
            label="Sizes"
            primary={true}
            className={'sortButton'}
            onTouchTap={this.sortBySize}
          />
          <RaisedButton
            label="Dates"
            primary={true}
            className={'sortButton'}
            onTouchTap={this.sortByDate}
          />
          <AutoComplete
            hintText="Type anything"
            dataSource={list}
            dataSourceConfig={{ text: 'name', value: 'name' }}
            onUpdateInput={this.handleUpdateInput}
            floatingLabelText="Search a file"
            fullWidth={false}
          />
        </div>
        <AbsoluteGrid
          items={list}
          keyProp={'name'}
          sortProp={this.state.sort}
          responsive={true}
          dragEnabled={true}
          itemWidth={160}
          itemHeight={160}
        />
      </div>
    );
  }
}
