import knex from './knex';
import {notifyAll} from './socket';

// map of table->handler for change events
const handlers = {};

export function addFeedHandler(table, fn) {
	if (handlers[table]) {
		throw new Error('overwriting changefeed handler for:', table);
	}

	handlers[table] = fn;
}


async function handleChange(payload) {
	const handler = handlers[payload.table];
	if (!handler) {
		console.warn('no handler defined for changefeed:', payload.table);
	}

	try {
		const record = await handler(payload);
		if (!record) return;

		notifyAll({
			operation: payload.type,
			table: payload.table,
			fn: 'change',
			record
		});
	} catch (e) {
		console.error(e);
	}
}


function setUpChangeFeed(client) {
	client.on('notification', (msg) => {
		if (msg.name !== 'notification' || msg.channel !== 'changefeed') {
			console.warn('unknown changefeed --', msg);
			return;
		}

		let payload;
		try {
			payload = JSON.parse(msg.payload);

			// make UPDATE lowercase to be more uniform
			payload = {...payload, type: payload.type.toLowerCase()};
		} catch (e) {
			console.error('[ERROR] invalid json:', msg.payload);
			return;
		}

		console.log('changefeed --', JSON.stringify(payload, null, 3));

		handleChange(payload);
	});

	client.query('LISTEN changefeed');
}


// XXX need some kind of reconnection logic here I think
function go() {
	knex.client.acquireRawConnection().then(setUpChangeFeed, (err) => {
		console.error(err);

		// guess we should just try again?
		setTimeout(go, 5000);
	});
}

go();
