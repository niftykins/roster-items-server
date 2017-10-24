import * as types from '../constants/types';

export function setSocketStatus(connected) {
	return {
		type: types.SOCKET_STATUS,
		payload: {status: connected}
	};
}
