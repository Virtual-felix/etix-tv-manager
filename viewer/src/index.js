import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import './index.css';
import App from './App';

// Initialize the request client.
window.httpClient = Axios.create({
  baseURL: 'http://127.0.0.1:4244',
});

ReactDOM.render(<App />, document.getElementById('root'));
