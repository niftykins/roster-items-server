import {Server as SocketServer} from 'ws';

import Users from './models/users';


// map of event->handlers for socket calls
const handlers = {};

// allow controllers to register event handlers themselves
export function addHandler(event, handler) {
	handlers[event] = handler;
}


function createMessageHandler(socket) {
	return async (raw) => {
		// XXX do we have to return a pong or does the library handle it?
		if (raw === 'ping') return;

		let message;
		try {
			message = JSON.parse(raw);
		} catch (e) {
			console.error('[ERROR] invalid json:', raw);
			return;
		}

		const reply = (error, data) => {
			const r = {
				// if it's an error, send back original data
				data: error ? message.data : data,

				echo: message.echo,
				fn: message.fn,
				ok: !error
			};

			if (error) r.error = error;

			socket.send(JSON.stringify(r), (err) => {
				if (err) console.error('[ERROR] failed to send:', err);
			});
		};

		console.log('on.message --', JSON.stringify(message, null, 3));

		const handler = handlers[message.fn];
		if (!handler) {
			console.error('[ERROR] missing handler:', raw);
			reply('unknown fn');

			return;
		}

		try {
			const data = await handler(message.data, socket.context);
			console.log('result --', JSON.stringify(data, null, 3));

			reply(null, data);
		} catch (e) {
			// XXX handle sending actual error message
			reply('Internal server error');
		}
	};
}

export default function setupSocket(server, sessionParser) {
	// populates the session data on the upgradeReq
	const verifyClient = (info, done) => {
		sessionParser(info.req, {}, () => done(true));
	};

	const ws = new SocketServer({
		perMessageDeflate: false,
		clientTracking: true,
		path: '/ws',

		verifyClient,
		server
	});

	ws.on('connection', async (socket) => {
		const {session} = socket.upgradeReq;

		const userId = session && session.passport && session.passport.user;

		let user = null;
		if (userId !== undefined) {
			user = await Users.findById(userId);
		}

		const context = {user};

		// eslint-disable-next-line no-param-reassign
		socket.context = context;

		console.log('connection', socket.upgradeReq.session.passport);
		socket.on('message', createMessageHandler(socket));
	});

	// setInterval(() => {
	// 	console.log('\nContexts:');

	// 	ws.clients.forEach((socket) => {
	// 		console.log(socket.context);
	// 	});
	// }, 5000);
}
