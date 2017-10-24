import {Record} from 'immutable';

import * as types from '../constants/types';

import ItemMap from '../models/itemMap';
import Item from '../models/item';

const initialState = new Record({
	search: '',

	formCreateNew: new Item(),
	byId: new ItemMap(),

	isLoading: false,
	error: null
})();

export default function items(state = initialState, action) {
	switch (action.type) {
		// UI
		case types.SEARCH_ITEMS: {
			return state.set('search', action.payload);
		}


		// FETCH
		case types.ITEMS_FETCH_REQUEST: {
			return state.merge({
				isLoading: true,
				error: null
			});
		}

		case types.ITEMS_FETCH_REFETCH: {
			return state.merge({
				isLoading: false,
				error: null
			});
		}

		case types.ITEMS_FETCH_SUCCESS: {
			const data = action.payload.items.map((item) => {
				return [item.id, new Item(item)];
			});

			return state.merge({
				byId: new ItemMap(data),
				isLoading: false,
				error: null
			});
		}

		case types.ITEMS_FETCH_FAILURE: {
			return state.merge({
				isLoading: false,
				error: action.payload
			});
		}


		// CREATE
		case types.ITEM_CREATE_REQUEST: {
			return state.setIn(
				['formCreateNew', Item.savingKey],
				true
			);
		}

		case types.ITEM_CREATE_SUCCESS: {
			return state.set('formCreateNew', new Item());
		}

		case types.ITEM_CREATE_FAILURE: {
			return state.setIn(
				['formCreateNew', Item.savingKey],
				false
			);
		}


		// UPDATE
		case types.ITEM_UPDATE_REQUEST: {
			return state.setIn(
				['byId', action.payload.itemId, Item.savingKey],
				true
			);
		}

		case types.ITEM_UPDATE_SUCCESS:
		case types.ITEM_UPDATE_FAILURE: {
			return state.setIn(
				['byId', action.payload.itemId, Item.savingKey],
				false
			);
		}

		// DELETE
		case types.ITEM_DELETE_REQUEST: {
			return state.setIn(
				['byId', action.payload.itemId, Item.deletingKey],
				true
			);
		}

		case types.ITEM_DELETE_SUCCESS:
		case types.ITEM_DELETE_FAILURE: {
			const path = ['byId', action.itemId, Item.deletingKey];

			// only set the value if the record exists
			if (state.hasIn(path)) {
				return state.setIn(path, false);
			}

			return state;
		}


		// FEED
		case types.FEED_ITEMS_INSERT: {
			return state.setIn(
				['byId', action.payload.id],
				new Item(action.payload)
			);
		}

		case types.FEED_ITEMS_UPDATE: {
			return state.mergeIn(
				['byId', action.payload.id],
				action.payload
			);
		}

		case types.FEED_ITEMS_DELETE: {
			return state.deleteIn(['byId', action.payload.id]);
		}

		default: return state;
	}
}

export function getItem(state, id, useForm) {
	if (!id && useForm) {
		return state.formCreateNew;
	}

	return state.byId.get(id) || new Item();
}

export function getItems(state) {
	return state.byId.toList()
		.sortBy((item) => item.name.toLowerCase());
}

export function getSearch(state) {
	return state.search;
}

export function getLoading(state) {
	return state.isLoading;
}

export function getError(state) {
	return state.error;
}
