import find from 'lodash/find';

import {addSocketHandlers, getClients} from '../socket';
import {addFeedHandler} from '../changefeed';

import RPC from '../constants/rpc';

import Users from '../models/users';


async function fetchSelf(data, context) {
	return Users.transformToSelf(context.user);
}

addSocketHandlers({
	[RPC.SELF_FETCH]: fetchSelf
});


// change feed
async function itemFeedHandler({newRecord, oldRecord}) {
	// we only care about updates
	if (!newRecord || !oldRecord) return null;

	const socket = find(getClients(), {
		context: {user: {id: newRecord.id}}
	});

	// if they're a user that's connected we need
	// to update their cached user record
	if (socket) {
		socket.context.user = newRecord;

		const payload = JSON.stringify({
			data: Users.transformToSelf(newRecord),
			fn: RPC.SELF_UPDATE,
			ok: true
		});

		socket.send(payload, (err) => {
			if (err) console.error(`[ERROR] failed to send ${RPC.SELF_UPDATE}:`, err);
		});
	}

	return null;
}

addFeedHandler(Users.table, itemFeedHandler);
