import {addFeedHandler} from '../changefeed';
import {addSocketHandlers} from '../socket';

import CODES from '../constants/codes';
import RPC from '../constants/rpc';

import ApiError from '../helpers/ApiError';

import Instances, {
	validateCreateInput
} from '../models/instances';


async function fetchInstances() {
	const instances = await Instances.findAll();

	return instances.map((i) => Instances.transform(i));
}

async function createInstance(raw, context) {
	if (!context.user) {
		throw new ApiError('Must be logged in to do that');
	}

	const valid = validateCreateInput(raw);
	if (valid.error) {
		throw new ApiError('Data did not pass validation');
	}

	try {
		return Instances.insert(valid.value);
	} catch (e) {
		console.log(e);

		if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
			throw new ApiError('An instance with that ID already exists');
		}

		throw new Error(e);
	}
}

addSocketHandlers({
	[RPC.INSTANCES_FETCH]: fetchInstances,
	[RPC.INSTANCE_CREATE]: createInstance
});


// change feed
async function instanceFeedHandler({newRecord, oldRecord}) {
	const r = newRecord || oldRecord;

	return Instances.transform(r);
}

addFeedHandler(Instances.table, instanceFeedHandler);
