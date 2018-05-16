import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import './i18n';
import Home from './components/home/Home';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Home />, document.getElementById('content'));
registerServiceWorker();
