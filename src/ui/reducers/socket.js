import * as types from '../constants/types';

export default function socket(state = false, action) {
	switch (action.type) {
		case types.SOCKET_STATUS:
			return action.payload.status;

		default: return state;
	}
}

export function getSocketStatus(state) {
	return state;
}
