import {addFeedHandler} from '../changefeed';
import {addSocketHandlers} from '../socket';

import CODES from '../constants/codes';
import RPC from '../constants/rpc';

import ApiError from '../helpers/ApiError';

import Instances, {
	validateCreateInput,
	validateUpdateInput,
	validateDeleteInput
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

async function updateInstance(raw, context) {
	if (!context.user) {
		throw new ApiError('Must be logged in to do that');
	}

	const valid = validateUpdateInput(raw);
	if (valid.error) {
		throw new ApiError('Data did not pass validation');
	}

	let result;
	try {
		const {id, ...data} = valid.value;
		result = await Instances.update(id, data);
	} catch (e) {
		console.log(e);

		throw new Error(e);
	}

	if (!result) {
		throw new ApiError('Nothing matches the passed ID');
	}

	return result;
}

async function deleteInstance(raw, context) {
	if (!context.user) {
		throw new ApiError('Must be logged in to do that');
	}

	const valid = validateDeleteInput(raw);
	if (valid.error) {
		throw new ApiError('Data did not pass validation');
	}

	let result;
	try {
		result = await Instances.delete(valid.value.id);
	} catch (e) {
		console.log(e);

		throw new Error(e);
	}

	if (!result) {
		throw new ApiError('Nothing matches the passed ID');
	}

	return result;
}

addSocketHandlers({
	[RPC.INSTANCES_FETCH]: fetchInstances,
	[RPC.INSTANCE_CREATE]: createInstance,
	[RPC.INSTANCE_UPDATE]: updateInstance,
	[RPC.INSTANCE_DELETE]: deleteInstance
});


// change feed
async function instanceFeedHandler({newRecord, oldRecord}) {
	const r = newRecord || oldRecord;

	return Instances.transform(r);
}

addFeedHandler(Instances.table, instanceFeedHandler);
