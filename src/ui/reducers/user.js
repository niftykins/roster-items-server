import * as types from '../constants/types';

import User from '../models/user';
const initialState = new User();

export default function user(state = initialState, action) {
	switch (action.type) {
		case types.RPC_SELF_UPDATE:
			return new User(action.payload.user);

		case types.SELF_FETCH_SUCCESS:
			return new User(action.payload.user);

		case types.SELF_LOGOUT_SUCCESS:
			return initialState;

		default: return state;
	}
}

export function getUser(state) {
	return state;
}
