export default class Socket {
	constructor(url, opts = {}) {
		this.handlers = {
			onMessage: opts.onMessage,

			onReconnect: opts.onReconnect,
			onClose: opts.onClose
		};


		this.hasPreviouslyConnected = false;
		this.queue = [];
		this.url = url;
	}

	connect(cb) {
		// if we're already connected we need to close it
		if (this.socket && this.socket.readyState) {
			this.socket.close();
		}


		if (cb) this.handlers.onConnect = cb;


		this.lastCheck = 0;
		this.lastPing = Date.now();

		this.reconnect();
	}

	reconnect() {
		if (this.socket) this.socket.close();

		this.socket = new WebSocket(this.url);
		this.socket.onopen = this.onOpen;
		this.socket.onclose = this.onClose;
		this.socket.onerror = this.onError;
		this.socket.onmessage = this.onMessage;
	}

	startChecker() {
		this.lastCheck = Date.now();
		this.lastPeriod = 1000;

		clearInterval(this.interval);
		this.interval = setInterval(this.checker, 1000);
	}

	checker = () => {
		if (this.socket.readyState === 1) {
			this.ping();
			return;
		}

		if ((this.lastCheck + this.lastPeriod) < Date.now()) {
			console.warn('[SOCKET] client reconnecting', this.lastPeriod);

			this.lastCheck = Date.now();
			this.lastPeriod = this.lastPeriod * 1.25;

			const max = 30 * 1000;
			if (this.lastPeriod > max) {
				this.lastPeriod = max;
			}

			this.reconnect();
		}
	}

	ping() {
		// every minute we need to ping to keep it alive
		if ((Date.now() - this.lastPing) > 60 * 1000) {
			this.lastPing = Date.now();
			this.socket.send('ping');
		}
	}

	send(data) {
		if (typeof data !== 'object') {
			console.error('[SOCKET] not an object:', data);
			return;
		}

		try {
			const message = JSON.stringify(data);

			// queue the socket calls until it's actually connected
			if (!this.socket || !this.socket.readyState) {
				this.queue.push(message);
				return;
			}

			console.warn('[SOCKET] sending:', data);
			this.socket.send(message);
		} catch (e) {
			console.error('[SOCKET]', data, e);
		}
	}

	onOpen = () => {
		console.warn('[SOCKET] client connected', this.url);
		this.startChecker();


		// send any queued messages so far
		while (this.queue.length) {
			const message = this.queue.shift();

			console.warn('[SOCKET] sending queued', JSON.parse(message));

			this.socket.send(message);
		}


		if (this.handlers.onConnect) {
			this.handlers.onConnect();

			delete this.handlers.onConnect;
		}

		// only want to trigger this on a reconnection
		if (this.hasPreviousConnected && this.handlers.onReconnect) {
			this.handlers.onReconnect();
		}

		this.hasPreviousConnected = true;
	}

	onClose = () => {
		console.warn('[SOCKET] client closed');

		if (this.handlers.onClose) {
			this.handlers.onClose();
		}
	}

	onError = (e) => {
		console.warn('[SOCKET] client error', e);

		if (!this.lastCheck) this.startChecker();
	}

	onMessage = (e) => {
		if (e.data === 'pong') return;

		const message = JSON.parse(e.data);
		console.warn('[SOCKET] message:', message);

		if (!message.ok && message.fn !== 'change') {
			console.error('[SOCKET] message failed:', message);
		}

		this.handlers.onMessage(message);
	}
}
