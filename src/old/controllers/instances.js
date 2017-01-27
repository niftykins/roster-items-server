import CODES from '../constants/codes';

import Instances from '../models/instances';

// queries
export function findAllInstances() {
	return Instances.findAll();
}

export function findInstance(root, {id}) {
	return Instances.findById(id);
}


// mutations
export async function createInstance(root, {instance}, context) {
	if (!context.user) {
		throw new Error('Must be logged in to create an instance');
	}

	try {
		return Instances.insert(instance);
	} catch (e) {
		console.error(e);

		if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
			throw new Error('Instance with that ID already exists');
		}

		throw new Error('Well something went badly');
	}
}

export async function updateInstance(root, {id, instance}, context) {
	if (!context.user) {
		throw new Error('Must be logged in to update an instance');
	}

	try {
		return Instances.update(id, instance);
	} catch (e) {
		console.error(e);

		if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
			throw new Error('Instance with that ID already exists');
		}

		throw new Error('Well something went badly');
	}
}
