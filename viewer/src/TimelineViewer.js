import React, { Component } from 'react';
import './TimelineViewer.css';
import { Player } from 'video-react';
import '../node_modules/video-react/dist/video-react.css';

const BASE_URL = 'http://127.0.0.1:8080/';

const Image = props => {
  return <img src={BASE_URL + props.src} alt={props.src} style={sImage} />;
};

const Video = props => {
  return <Player src={BASE_URL + props.src} autoPlay={true} muted={true} />;
};

export default class TimelineViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      img: '',
      timeoutId: undefined,
      version: undefined,
    };
  }

  componentWillReceiveProps = nextProps => {
    const items = nextProps.items.map(item => {
      var arr = item.name.split('.');
      var type = arr[arr.length - 1];
      if (type === 'mp4' || type === 'mkv') {
        item.html = Video({ src: item.name });
      } else {
        item.html = Image({ src: item.name });
      }
      return item;
    });
    const version = Date.now();
    this.setState(
      state => {
        return { version: version };
      },
      () => {
        this.loop(0, items, version);
      },
    );
  };

  loop = (index, timeline, version) => {
    if (timeline.length === 0 || version !== this.state.version) {
      return;
    }
    if (index >= timeline.length) {
      index = 0;
    }
    this.setState(state => {
      return { img: timeline[index] };
    });

    setTimeout(() => {
      this.loop(index + 1, timeline, version);
    }, parseInt(timeline[index].time) * 1000);
  };

  render() {
    return (
      <div className={'viewer'}>
        {this.state.img.html}
      </div>
    );
  }
}

// Inline style

const sImage = {
  width: '100%',
  height: 'auto',
};
