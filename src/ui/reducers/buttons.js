import {Record} from 'immutable';

import * as types from '../constants/types';

import ButtonMap from '../models/buttonMap';
import Button from '../models/button';

const initialState = new Record({
	formCreateNew: new Button(),
	byId: new ButtonMap(),

	isLoading: false,
	error: null
})();

export default function buttons(state = initialState, action) {
	switch (action.type) {
		// FETCH
		case types.BUTTONS_FETCH_REQUEST: {
			return state.merge({
				isLoading: true,
				error: null
			});
		}

		case types.BUTTONS_FETCH_REFETCH: {
			return state.merge({
				isLoading: false,
				error: null
			});
		}

		case types.BUTTONS_FETCH_SUCCESS: {
			const data = action.payload.buttons.map((button) => {
				return [button.id, new Button(button)];
			});

			return state.merge({
				byId: new ButtonMap(data),
				isLoading: false,
				error: null
			});
		}

		case types.BUTTONS_FETCH_FAILURE: {
			return state.merge({
				isLoading: false,
				error: action.payload
			});
		}


		// CREATE
		case types.BUTTON_CREATE_REQUEST: {
			return state.setIn(
				['formCreateNew', Button.savingKey],
				true
			);
		}

		case types.BUTTON_CREATE_SUCCESS: {
			return state.set('formCreateNew', new Button());
		}

		case types.BUTTON_CREATE_FAILURE: {
			return state.setIn(
				['formCreateNew', Button.savingKey],
				false
			);
		}


		// UPDATE
		case types.BUTTON_UPDATE_REQUEST: {
			return state.setIn(
				['byId', action.payload.buttonId, Button.savingKey],
				true
			);
		}

		case types.BUTTON_UPDATE_SUCCESS:
		case types.BUTTON_UPDATE_FAILURE: {
			return state.setIn(
				['byId', action.payload.buttonId, Button.savingKey],
				false
			);
		}

		// DELETE
		case types.BUTTON_DELETE_REQUEST: {
			return state.setIn(
				['byId', action.payload.buttonId, Button.deletingKey],
				true
			);
		}

		case types.BUTTON_DELETE_SUCCESS:
		case types.BUTTON_DELETE_FAILURE: {
			const path = ['byId', action.buttonId, Button.deletingKey];

			// only set the value if the record exists
			if (state.hasIn(path)) {
				return state.setIn(path, false);
			}

			return state;
		}


		// FEED
		case types.FEED_BUTTONS_INSERT: {
			return state.setIn(
				['byId', action.payload.id],
				new Button(action.payload)
			);
		}

		case types.FEED_BUTTONS_UPDATE: {
			return state.mergeIn(
				['byId', action.payload.id],
				action.payload
			);
		}

		case types.FEED_BUTTONS_DELETE: {
			return state.deleteIn(['byId', action.payload.id]);
		}

		default: return state;
	}
}

export function getButton(state, id, useForm) {
	if (!id && useForm) {
		return state.formCreateNew;
	}

	return state.byId.get(id) || new Button();
}

export function getButtons(state) {
	return state.byId.toList()
		.sortBy((button) => button.name);
}

export function getLoading(state) {
	return state.isLoading;
}

export function getError(state) {
	return state.error;
}
