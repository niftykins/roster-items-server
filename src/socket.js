import {Server as SocketServer} from 'ws';

export default function setupSocket(server, sessionParser) {
	// populates the session data on the upgradeReq
	const verifyClient = (info, done) => {
		sessionParser(info.req, {}, () => done(true));
	};

	const ws = new SocketServer({
		perMessageDeflate: false,
		path: '/ws',

		verifyClient,
		server
	});

	ws.on('connection', (socket) => {
		console.log('connection', socket.upgradeReq.session.passport);
	});
}
