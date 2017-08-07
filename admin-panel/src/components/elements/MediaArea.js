import React, { Component } from 'react';
import createAbosluteGrid from 'react-absolute-grid';
import MediaTile from './MediaTile';
import AutoComplete from 'material-ui/AutoComplete';

const style = {
  margin: 30,
};

const AbsoluteGrid = createAbosluteGrid(MediaTile);

export default class MediaArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaList: [],
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
    this.state.mediaList = this.state.mediaList.map(function(item) {
      const isMatched = !item.name.match(search);
      if (!item.filtered || isMatched !== item.filtered) {
        return {
          ...item,
          filtered: isMatched,
        };
      }
      return item;
    });
    this.setState({ mediaList: this.state.mediaList });
  };

  render() {
    const list = this.state.mediaList;
    list.map(item => {
      item.onRemove = this.onRemoveTile;
      return item;
    });

    return (
      <div style={style}>
        <AutoComplete
          hintText="Type anything"
          dataSource={list}
          dataSourceConfig={{ text: 'name', value: 'name' }}
          onUpdateInput={this.handleUpdateInput}
          floatingLabelText="Full width"
          fullWidth={true}
        />
        <AbsoluteGrid
          items={list}
          keyProp={'name'}
          responsive={true}
          dragEnabled={true}
          itemWidth={160}
          itemHeight={160}
        />
      </div>
    );
  }
}
