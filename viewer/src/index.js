import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import './index.css';
import App from './App';

// Initialize the request client.
window.httpClient = Axios.create({
  baseURL: 'http://' + process.env.REACT_APP_API_URL + ':' + process.env.REACT_APP_API_PORT,
});

ReactDOM.render(<App />, document.getElementById('root'));
