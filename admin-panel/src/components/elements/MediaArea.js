import React, { Component } from 'react';
import createAbosluteGrid from 'react-absolute-grid';
import MediaTile from './MediaTile';

const AbsoluteGrid = createAbosluteGrid(MediaTile, {});

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

  render() {
    return (
      <div style={style}>
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
