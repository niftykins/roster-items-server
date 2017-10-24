import {browserHistory} from 'react-router';

import * as types from '../constants/types';

import {addSuccessBanner, addErrorBanner} from './banners';

export function searchItems(search) {
	return {
		type: types.SEARCH_ITEMS,
		payload: search
	};
}

export function fetchItems(isRefetch) {
	return (dispatch, getState, api) => {
		dispatch({
			type: isRefetch ? types.ITEMS_FETCH_REFETCH : types.ITEMS_FETCH_REQUEST
		});

		api.call(types.RPC_ITEMS_FETCH).then(
			(message) => {
				dispatch({
					type: types.ITEMS_FETCH_SUCCESS,
					payload: {items: message.data}
				});
			},

			(message) => {
				dispatch({
					type: types.ITEMS_FETCH_FAILURE,
					payload: message.error
				});
			}
		);
	};
}

export function autofillItem(url, cb) {
	return (dispatch, getState, api) => {
		dispatch({type: types.ITEM_AUTOFILL_REQUEST});

		api.call(types.RPC_ITEM_AUTOFILL, {url}).then(
			(message) => {
				dispatch({type: types.ITEM_AUTOFILL_SUCCESS});

				if (cb) cb(message.data);
			},

			(message) => {
				dispatch({type: types.ITEM_AUTOFILL_FAILURE});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}

export function createItem(data) {
	return (dispatch, getState, api) => {
		dispatch({type: types.ITEM_CREATE_REQUEST});

		api.call(types.RPC_ITEM_CREATE, data).then(
			(message) => {
				dispatch({type: types.ITEM_CREATE_SUCCESS});

				dispatch(addSuccessBanner('Item saved'));

				browserHistory.push(`/items/${message.data.id}`);
			},

			(message) => {
				dispatch({type: types.ITEM_CREATE_FAILURE});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}

export function updateItem(itemId, data, cb) {
	return (dispatch, getState, api) => {
		dispatch({
			type: types.ITEM_UPDATE_REQUEST,
			payload: {itemId}
		});

		api.call(types.RPC_ITEM_UPDATE, {
			id: itemId,
			...data
		}).then(
			() => {
				dispatch({
					type: types.ITEM_UPDATE_SUCCESS,
					payload: {itemId}
				});

				dispatch(addSuccessBanner('Item saved'));

				if (cb) cb();
			},

			(message) => {
				dispatch({
					type: types.ITEM_UPDATE_FAILURE,
					payload: {itemId}
				});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}

export function deleteItem(itemId) {
	return (dispatch, getState, api) => {
		dispatch({
			type: types.ITEM_DELETE_REQUEST,
			payload: {itemId}
		});

		api.call(types.RPC_ITEM_DELETE, {id: itemId}).then(
			() => {
				dispatch({
					type: types.ITEM_DELETE_SUCCESS,
					payload: {itemId}
				});

				dispatch(addSuccessBanner('Item removed'));
				browserHistory.push('/items');
			},

			(message) => {
				dispatch({
					type: types.ITEM_DELETE_FAILURE,
					payload: {itemId}
				});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}
