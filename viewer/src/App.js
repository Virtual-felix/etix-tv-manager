import React, { Component } from 'react';
import TimelineViewer from './TimelineViewer';
import moment from 'moment';
import './App.css';

// API Requests

const GetAllItems = timelineID => {
  const data = new FormData();
  data.append('tid', timelineID);

  return window.httpClient.get('timeline/' + timelineID + '/items');
};

const GetPlanifications = () => {
  return window.httpClient.get('/planifications/tv');
};

const GetTimeline = id => {
  return window.httpClient.get('/timeline/' + id);
};

// Main

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timelines: [],
      items: [],
      selectedPlanification: undefined,
      summary: false,
    };
  }

  componentWillMount = () => {
    this.refreshPlanifications();
    this.updateWorker();
  };

  refreshPlanifications = () => {
    GetPlanifications()
      .then(response => {
        if (response.data === '') {
          return;
        }
        var selected = -1;
        for (var i = 0; i < response.data.length; i++) {
          const start = moment(response.data[i].startAt);
          const end = moment(response.data[i].endAt);
          const now = moment();

          if (start - now < 0 && end - now > 0) {
            if (
              this.state.selectedPlanification &&
              response.data[i].id === this.state.selectedPlanification.id
            ) {
              break;
            }
            selected = i;
            break;
          }
        }
        if (selected >= 0) {
          this.setState(state => {
            return { selectedPlanification: response.data[selected] };
          }, this.refreshTimelineItems);
        }
      })
      .catch(error => {
        console.log('Get planifications: ', error);
      });
  };

  refreshTimelineItems = () => {
    if (!this.state.selectedPlanification) {
      return;
    }
    GetAllItems(this.state.selectedPlanification.tiid)
      .then(response => {
        this.setState(state => {
          return { items: response.data };
        }, this.refreshTimeline);
      })
      .catch(error => {
        console.log('Get all timeline items failed: ', error);
      });
  };

  refreshTimeline = () => {
    if (!this.state.selectedPlanification) {
      return;
    }
    GetTimeline(this.state.selectedPlanification.tiid)
      .then(response => {
        this.setState(state => {
          return { summary: response.data.summary };
        });
      })
      .catch(error => {
        console.log('Get timeline failed: ', error);
      });
  };

  updateWorker = () => {
    setTimeout(() => {
      this.refreshPlanifications();
      this.updateWorker();
    }, 60 * 1000);
  };

  render() {
    return (
      <div className="App" style={sContainer}>
        <TimelineViewer items={this.state.items} summary={this.state.summary} />
      </div>
    );
  }
}

export default App;

// Inline styles

const sContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
};
