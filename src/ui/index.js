import 'babel-polyfill';
import 'isomorphic-fetch';

// favicon (http://support.flaticon.com/hc/en-us/articles/207248209-How-I-must-insert-the-attribution-)
import './images/logo.png';
import './styles/index.styl';

import React from 'react';
import {render} from 'react-dom';
window.React = React;

import configureStore from './store';
const store = configureStore();
window.store = store;

import {syncApiWithStore} from './helpers/api';
syncApiWithStore(store);

import {Provider} from 'react-redux';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import makeRouter from './routes';
const history = syncHistoryWithStore(browserHistory, store);
const router = makeRouter(history, store);

render(
	<Provider store={store}>
		{router}
	</Provider>,
	document.getElementById('root')
);
