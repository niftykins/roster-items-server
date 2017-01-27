import {Server as SocketServer} from 'ws';

export default function setupSocket(server, sessionParser) {
	const verifyClient = (info, done) => {
		sessionParser(info.req, {}, () => {
			console.log('VERIFY', info.req.session, info.req.user);

			done(true);
		});
	};

	const ws = new SocketServer({
		perMessageDeflate: false,
		verifyClient,
		server
	});

	ws.on('connection', (socket) => {
		console.log('Client connected', socket.upgradeReq.session);
		socket.on('close', () => console.log('Client disconnected'));
	});
}
