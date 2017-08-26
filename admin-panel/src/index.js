import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import Axios from 'axios';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

var token = sessionStorage.getItem('token');
if (!token) {
  token = 'NOT CONNECTED';
}

// Initialize the request client.
window.httpClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: 'Bearer ' + token,
  },
  transformResponse: data => {
    if (data === '' || data === undefined) {
      return data;
    }
    var obj = JSON.parse(data);
    if (obj.message === 'Unauthorized' && window.location.pathname !== '/login') {
      sessionStorage.setItem('token', undefined);
      window.location.replace('/login');
    }
    return obj;
  },
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);
