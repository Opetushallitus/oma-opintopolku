import './polyfills'
import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import './i18n';
import Home from './components/home/Home';
import { getUser, login, logout } from './utils';

window.Service = {
  login,
  logout,
  getUser
};

const domNode = document.getElementById('content');
const content = createRoot(domNode);

content.render(<Home ref={(home) => {window.home = home}} />);
