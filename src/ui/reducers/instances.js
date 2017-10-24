import {Record} from 'immutable';

import * as types from '../constants/types';

import InstanceMap from '../models/instanceMap';
import Instance from '../models/instance';

const initialState = new Record({
	formCreateNew: new Instance(),
	byId: new InstanceMap(),

	isLoading: false,
	error: null
})();

export default function instances(state = initialState, action) {
	switch (action.type) {
		// FETCH
		case types.INSTANCES_FETCH_REQUEST: {
			return state.merge({
				isLoading: true,
				error: null
			});
		}

		case types.INSTANCES_FETCH_REFETCH: {
			return state.merge({
				isLoading: false,
				error: null
			});
		}

		case types.INSTANCES_FETCH_SUCCESS: {
			const data = action.payload.instances.map((instance) => {
				return [instance.id, new Instance(instance)];
			});

			return state.merge({
				byId: new InstanceMap(data),
				isLoading: false,
				error: null
			});
		}

		case types.INSTANCES_FETCH_FAILURE: {
			return state.merge({
				isLoading: false,
				error: action.payload
			});
		}


		// CREATE
		case types.INSTANCE_CREATE_REQUEST: {
			return state.setIn(
				['formCreateNew', Instance.savingKey],
				true
			);
		}

		case types.INSTANCE_CREATE_SUCCESS: {
			return state.set('formCreateNew', new Instance());
		}

		case types.INSTANCE_CREATE_FAILURE: {
			return state.setIn(
				['formCreateNew', Instance.savingKey],
				false
			);
		}


		// UPDATE
		case types.INSTANCE_UPDATE_REQUEST: {
			return state.setIn(
				['byId', action.payload.instanceId, Instance.savingKey],
				true
			);
		}

		case types.INSTANCE_UPDATE_SUCCESS:
		case types.INSTANCE_UPDATE_FAILURE: {
			return state.setIn(
				['byId', action.payload.instanceId, Instance.savingKey],
				false
			);
		}

		// DELETE
		case types.INSTANCE_DELETE_REQUEST: {
			return state.setIn(
				['byId', action.payload.instanceId, Instance.deletingKey],
				true
			);
		}

		case types.INSTANCE_DELETE_SUCCESS:
		case types.INSTANCE_DELETE_FAILURE: {
			const path = ['byId', action.instanceId, Instance.deletingKey];

			// only set the value if the record exists
			if (state.hasIn(path)) {
				return state.setIn(path, false);
			}

			return state;
		}


		// FEED
		case types.FEED_INSTANCES_INSERT: {
			return state.setIn(
				['byId', action.payload.id],
				new Instance(action.payload)
			);
		}

		case types.FEED_INSTANCES_UPDATE: {
			return state.mergeIn(
				['byId', action.payload.id],
				action.payload
			);
		}

		case types.FEED_INSTANCES_DELETE: {
			return state.deleteIn(['byId', action.payload.id]);
		}

		default: return state;
	}
}

export function getInstance(state, id, useForm) {
	if (!id && useForm) {
		return state.formCreateNew;
	}

	return state.byId.get(id) || new Instance();
}

export function getInstances(state) {
	return state.byId.toList()
		.sortBy((instance) => instance.released)
		.reverse();
}

export function getLoading(state) {
	return state.isLoading;
}

export function getError(state) {
	return state.error;
}
