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

// Main

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timelines: [],
      items: [],
      selectedPlanification: undefined,
    };
  }

  //2017-08-15T03:00:00Z

  componentWillMount = () => {
    this.refreshPlanifications();
    this.updateWorker();
  };

  refreshPlanifications = () => {
    GetPlanifications()
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          const start = moment(response.data[i].startAt);
          const end = moment(response.data[i].endAt);
          const now = moment();

          if (start - now < 0 && end - now > 0) {
            if (
              this.state.selectedPlanification &&
              response.data[i].id == this.state.selectedPlanification.id
            ) {
              break;
            }
            this.setState(state => {
              return { selectedPlanification: response.data[i] };
            }, this.refreshTimelineItems);
            break;
          }
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
        });
      })
      .catch(error => {
        console.log('Get all timeline items: ', error);
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
        <TimelineViewer items={this.state.items} />
      </div>
    );
  }
}

export default App;

// Inline styles

const sContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
};
