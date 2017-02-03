import {addFeedHandler} from '../changefeed';
import {addSocketHandlers} from '../socket';

import CODES from '../constants/codes';
import RPC from '../constants/rpc';

import ApiError from '../helpers/ApiError';

import {
	requireAuth,
	requireValidation,
	requireResult
} from './middleware';

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
	requireAuth(context);
	const value = requireValidation(validateCreateInput, raw);

	try {
		return Instances.insert(value);
	} catch (e) {
		if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
			throw new ApiError('An instance with that ID already exists');
		}

		throw e;
	}
}

async function updateInstance(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateUpdateInput, raw);

	const {id, ...data} = value;
	const result = await Instances.update(id, data);
	requireResult(result);

	return result;
}

async function deleteInstance(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateDeleteInput, raw);

	const result = await Instances.delete(value.id);
	requireResult(result);

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
