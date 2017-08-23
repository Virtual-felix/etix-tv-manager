import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import AppTheme from '../../constants/DesignApp.js';
import './UploadArea.css';

// API Requests

const UploadFile = (file, setProgress) => {
  const data = new FormData();
  data.append('name', file.name);
  data.append('type', file.type);
  data.append('size', file.size);
  data.append('file', file);

  return window.httpClient.post('/restricted/upload', data, {
    onUploadProgress: event => {
      setProgress(event.loaded, event.total);
    },
  });
};

// Main

export default class UploadArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      completionTotal: 0,
      maxTotal: 0,
      completion: 0,
      max: 0,
    };
  }

  uploadFile = file => {
    UploadFile(file, (loaded, total) => {
      this.setState({ completion: loaded, max: total });
    })
      .then(response => {
        this.setState(state => {
          return { completionTotal: this.state.completionTotal + 1 };
        });
        this.props.onFileUploaded();
      })
      .catch(error => {
        // NOTE: Show an error with information about which file failed.
        // Maybe use a Snackbar or other kind of notifications.
        this.setState(state => {
          return { maxTotal: this.state.maxTotal - 1 };
        });
      });
  };

  onDrop = (files, rejected) => {
    this.setState(state => {
      return { completionTotal: 0, maxTotal: files.length };
    });
    files.forEach(file => {
      this.uploadFile(file);
    });
  };

  render() {
    return (
      <div>
        <LinearProgress
          mode="determinate"
          value={this.state.completionTotal}
          max={this.state.maxTotal}
          color={AppTheme.palette.primary2Color}
          style={{ borderRadius: 0 }}
        />
        <LinearProgress
          mode="determinate"
          value={this.state.completion}
          max={this.state.max}
          color={AppTheme.palette.primary2Color}
          style={{ borderRadius: 0 }}
        />
        <Dropzone onDrop={this.onDrop} style={{}}>
          <Paper style={zoneStyle} zDepth={1} rounded={false} className={'stripe'}>
            <p>Drag and drop your files here. Accept JPEG, PNG, MKV, MP4 format.</p>
          </Paper>
        </Dropzone>
      </div>
    );
  }
}

// Inline styles

const zoneStyle = {
  height: 100,
  width: '100%',
  margin: 0,
  padding: 0,
  textAlign: 'center',
  display: 'inline-block',
};
