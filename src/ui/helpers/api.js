/* eslint class-methods-use-this:0 */

import * as types from '../constants/types';

import {addSocketBanner, removeSocketBanner} from '../actions/banners';
import {setSocketStatus} from '../actions/socket';

import {getSocketStatus} from './selectors';
import Socket from './socket';


let store;
export const syncApiWithStore = (s) => (store = s);


function handleChange({table, operation, record}) {
	const type = `feed_${table}_${operation}`;

	store.dispatch({
		payload: record,
		type
	});
}

function handleSelfUpdate(message) {
	store.dispatch({
		payload: {user: message.data},
		type: types.RPC_SELF_UPDATE
	});
}


let count = 0;
const requests = {};

class API {
	constructor() {
		this.reconnectionHandlers = [];
		this.hasBeenConnected = false;

		// every so often check if there's requests we should
		// just remove because they're obviously broken
		setInterval(() => {
			Object.keys(requests).forEach((key) => {
				const request = requests[key];

				// timeout if the request is more than 5 minutes old
				if (request.ts < Date.now() - (5 * 60 * 1000)) {
					request.reject({
						error: 'Request timed out',
						ok: false
					});

					delete requests[key];
				}
			});
		}, 10 * 1000);


		this.socket = new Socket(`wss://${window.location.host}/api/ws`, {
			onReconnect: this.handleSocketReconnect,
			onClose: this.handleSocketClose,

			onMessage: this.handleSocketMessage
		});

		this.socket.connect(this.handleSocketConnect);
	}

	callHTTP(endpoint, opts = {}) {
		return fetch(`/api/${endpoint}`, {
			...opts,
			credentials: 'include'
		}).then((r) => r.json());
	}

	call(fn, data = {}) {
		return new Promise((resolve, reject) => {
			// if isn't pre-connection queuing and the socket is down
			// we want to just error out and tell them what happened
			if (this.hasBeenConnected && !getSocketStatus(store.getState())) {
				reject({
					error: 'Unable to make request while connection is down',
					ok: false
				});

				return;
			}


			count += 1;
			const callId = count;

			requests[callId] = {
				ts: Date.now(),
				resolve,
				reject
			};

			const message = {
				echo: {callId},
				data,
				fn
			};

			this.socket.send(message);
		});
	}


	handleSocketMessage(message) {
		if (message.fn === 'change') {
			handleChange(message);
			return;
		}

		if (message.fn === 'self_update') {
			handleSelfUpdate(message);
			return;
		}

		const request = requests[message.echo.callId];
		if (!request) {
			console.warn('API request not found for:', message);
			return;
		}

		delete requests[message.echo];

		if (message.ok) request.resolve(message);
		else request.reject(message);
	}

	handleSocketConnect = () => {
		this.hasBeenConnected = true;

		store.dispatch(setSocketStatus(true));

		// need to trigger a banner being removed on connection
		// in case theres issues during the initial connection
		removeSocketBanner()(store.dispatch);
	}

	handleSocketReconnect = () => {
		store.dispatch(setSocketStatus(true));
		removeSocketBanner()(store.dispatch);

		// call any reconnection handlers we have
		this.reconnectionHandlers.forEach((fn) => fn(true));
	}

	handleSocketClose = () => {
		store.dispatch(setSocketStatus(false));
		addSocketBanner()(store.dispatch);
	}


	registerReconnectionHandler(fn) {
		if (!this.reconnectionHandlers.includes(fn)) {
			this.reconnectionHandlers.push(fn);
		}
	}
}

const api = new API();
export default api;
window.api = api;
