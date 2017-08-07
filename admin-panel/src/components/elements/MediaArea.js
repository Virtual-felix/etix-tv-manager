import React, { Component } from 'react';
import createAbosluteGrid from 'react-absolute-grid';
import MediaTile from './MediaTile';
import AutoComplete from 'material-ui/AutoComplete';

const style = {
  margin: 30,
};

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

  onRemoveTile = (success, response) => {
    if (success) {
      this.refreshMediaList();
    }
  };

  handleUpdateInput = value => {
    this.state.mediaList.map(item => {
      if (item.name.toLowerCase().indexOf(value) === -1) {
        item.filtered = true;
      } else {
        item.filtered = false;
      }
      return item;
    });
    this.setState({ mediaList: this.state.mediaList });
  };

  render() {
    const AbsoluteGrid = createAbosluteGrid(MediaTile, { onRemove: this.onRemoveTile });

    return (
      <div style={style}>
        <AutoComplete
          hintText="Type anything"
          dataSource={this.state.mediaList}
          dataSourceConfig={{ text: 'name', value: 'name' }}
          onUpdateInput={this.handleUpdateInput}
          floatingLabelText="Full width"
          fullWidth={true}
        />
        <AbsoluteGrid
          items={this.state.mediaList}
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
