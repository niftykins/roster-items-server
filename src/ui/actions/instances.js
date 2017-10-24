import {browserHistory} from 'react-router';

import * as types from '../constants/types';

import {addSuccessBanner, addErrorBanner} from './banners';

export function fetchInstances(isRefetch) {
	return (dispatch, getState, api) => {
		dispatch({
			type: isRefetch ? types.INSTANCES_FETCH_REFETCH : types.INSTANCES_FETCH_REQUEST
		});

		api.call(types.RPC_INSTANCES_FETCH).then(
			(message) => {
				dispatch({
					type: types.INSTANCES_FETCH_SUCCESS,
					payload: {instances: message.data}
				});
			},

			(message) => {
				dispatch({
					type: types.INSTANCES_FETCH_FAILURE,
					payload: message.error
				});
			}
		);
	};
}

export function createInstance(data) {
	return (dispatch, getState, api) => {
		dispatch({type: types.INSTANCE_CREATE_REQUEST});

		api.call(types.RPC_INSTANCE_CREATE, data).then(
			(message) => {
				dispatch({type: types.INSTANCE_CREATE_SUCCESS});

				dispatch(addSuccessBanner('Instance saved'));

				browserHistory.push(`/instances/${message.data.id}`);
			},

			(message) => {
				dispatch({type: types.INSTANCE_CREATE_FAILURE});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}

export function updateInstance(instanceId, data, cb) {
	return (dispatch, getState, api) => {
		dispatch({
			type: types.INSTANCE_UPDATE_REQUEST,
			payload: {instanceId}
		});

		api.call(types.RPC_INSTANCE_UPDATE, {
			id: instanceId,
			...data
		}).then(
			() => {
				dispatch({
					type: types.INSTANCE_UPDATE_SUCCESS,
					payload: {instanceId}
				});

				dispatch(addSuccessBanner('Instance saved'));

				if (cb) cb();
			},

			(message) => {
				dispatch({
					type: types.INSTANCE_UPDATE_FAILURE,
					payload: {instanceId}
				});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}

export function deleteInstance(instanceId) {
	return (dispatch, getState, api) => {
		dispatch({
			type: types.INSTANCE_DELETE_REQUEST,
			payload: {instanceId}
		});

		api.call(types.RPC_INSTANCE_DELETE, {id: instanceId}).then(
			() => {
				dispatch({
					type: types.INSTANCE_DELETE_SUCCESS,
					payload: {instanceId}
				});

				dispatch(addSuccessBanner('Instance removed'));
				browserHistory.push('/instances');
			},

			(message) => {
				dispatch({
					type: types.INSTANCE_DELETE_FAILURE,
					payload: {instanceId}
				});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}
