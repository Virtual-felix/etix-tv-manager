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

// Helper

const uniqueArray = a => [...new Set(a)];

// Main

export default class TimelineViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      img: '',
      timeoutId: undefined,
      version: undefined,
      categories: [],
      index: 0,
    };
  }

  componentWillReceiveProps = nextProps => {
    var categories = [];
    const items = nextProps.items.map(item => {
      var arr = item.name.split('.');
      categories.push(item.category);
      var type = arr[arr.length - 1];
      item.type = type;
      if (type === 'mp4' || type === 'mkv') {
        item.html = Video({ src: item.name, type: type });
      } else {
        item.html = Image({ src: item.name });
      }
      return item;
    });
    categories = uniqueArray(categories);
    const version = Date.now();
    this.setState(
      state => {
        return { version: version, categories: categories };
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
      return { img: timeline[index], index: index };
    });

    setTimeout(() => {
      this.loop(index + 1, timeline, version);
    }, parseInt(timeline[index].time) * 1000);
  };

  render() {
    return (
      <div className={'viewer'}>
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%' }}>
          {this.props.summary &&
            <div style={sSummary}>
              {this.state.categories.map(c => {
                const active = c === this.props.items[this.state.index].category ? true : false;
                return (
                  <div style={sCategory} key={c}>
                    <div style={{ color: active ? 'white' : 'grey' }}>
                      {' '}{c}{' '}
                    </div>
                  </div>
                );
              })}
            </div>}
        </div>
        {
          <div style={{ top: 0, left: 0, zIndex: 0, width: '100%' }}>
            {this.state.img.type === 'mp4' || this.state.img.type === 'mkv'
              ? Video({ src: this.state.img.name, type: this.state.img.type })
              : Image({ src: this.state.img.name })}
          </div>
        }
      </div>
    );
  }
}

// Inline stylew

const sImage = {
  maxWidth: '100%',
  maxHeight: '100%',
};

const sSummary = {
  width: '100%',
  height: 60,
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 42,
  display: 'flex',
  justifyContent: 'center',
};

const sCategory = {
  marginTop: 'auto',
  marginBottom: 'auto',
  marginRight: 20,
  marginLeft: 20,
};
