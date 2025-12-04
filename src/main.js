import './polyfills'
import React from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import './i18n';
import { loadRaamit } from './lib/loadRaamit';
import Home from './components/home/Home';
import { getUser, login, logout } from './utils';
import {configureUrls} from "./urls";

window.Service = {
  login,
  logout,
  getUser
};


const domNode = document.getElementById('content');
const content = createRoot(domNode);
const start = async () => {
  await configureUrls();
  await loadRaamit().catch(err => console.error('Raamit load failed', err));
  content.render(<Home ref={home => {window.home = home;}} />)
};

start();
