import React, { Component } from 'react';
import UploadArea from '../components/elements/UploadArea';
import MediaArea from '../components/elements/MediaArea';
import TimelineCreationArea from '../components/elements/TimelineCreationArea';

// API Requests

const GetAllFiles = () => {
  return window.httpClient.get('/media/list/');
};

const GetAllTimelines = () => {
  return window.httpClient.get('/timeline');
};

const GetAllItems = timelineID => {
  const data = new FormData();
  data.append('tid', timelineID);

  return window.httpClient.get('timeline/' + timelineID + '/items');
};

const AddFileToTimeline = (timelineID, name, index) => {
  const data = new FormData();
  data.append('name', name);
  data.append('index', index);

  return window.httpClient.post('/timeline/' + timelineID + '/item', data);
};

// Main

export default class FilesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      timelines: [],
      timelineItems: [],
      selectedTimeline: 0,
    };
  }

  componentWillMount = () => {
    this.refreshFiles();
    this.refreshTimelines();
  };

  refreshFiles = () => {
    GetAllFiles()
      .then(response => {
        this.setState(state => {
          return { files: response.data };
        });
      })
      .catch(error => {
        console.log('Get all files: ', error);
      });
  };

  refreshTimelines = () => {
    GetAllTimelines()
      .then(response => {
        this.setState(state => {
          return { timelines: response.data };
        }, this.refreshTimelineItems);
      })
      .catch(error => {
        console.log('Get all timelines: ', error);
      });
  };

  refreshTimelineItems = () => {
    if (this.state.timelines.length === 0) {
      return;
    }
    GetAllItems(this.state.timelines[this.state.selectedTimeline].id)
      .then(response => {
        this.setState(state => {
          return { timelineItems: response.data };
        });
      })
      .catch(error => {
        console.log('Get all timeline items: ', error);
      });
  };

  selectTimeline = index => {
    this.setState(state => {
      return { selectedTimeline: index };
    }, this.refreshTimelineItems);
  };

  addFile = name => {
    if (this.state.timelines.length === 0) {
      return;
    }
    AddFileToTimeline(
      this.state.timelines[this.state.selectedTimeline].id,
      name,
      this.state.timelineItems.length,
    )
      .then(response => {
        this.refreshTimelineItems();
      })
      .catch(error => {
        console.log('Add file to timeline: ', error);
      });
  };

  render() {
    return (
      <div>
        <UploadArea onFileUploaded={this.refreshFiles} />
        <MediaArea
          files={this.state.files}
          refreshFiles={this.refreshFiles}
          onAddFile={this.addFile}
        />
        <TimelineCreationArea
          timelines={this.state.timelines}
          items={this.state.timelineItems}
          selectedTimeline={this.state.selectedTimeline}
          onTimelineSelection={this.selectTimeline}
          onTimelineCreation={this.refreshTimelines}
          onUpdateItems={this.refreshTimelineItems}
          onUpdate={this.refreshTimelines}
        />
      </div>
    );
  }
}
