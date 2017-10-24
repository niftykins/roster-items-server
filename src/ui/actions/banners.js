import * as types from '../constants/types';

let bannerId = 0;
function setBanner(type, message, showForever) {
	return (dispatch) => {
		bannerId += 1;
		const id = bannerId;

		dispatch({
			type: types.BANNER_ADD,
			payload: {
				id,
				message,
				type
			}
		});

		if (!showForever) {
			// clear the banner after some time
			const timer = type !== 'error' ? 3500 : 7000;

			setTimeout(() => {
				dispatch({
					type: types.BANNER_REMOVE,
					payload: {id}
				});
			}, timer);
		}
	};
}

export function addSuccessBanner(message) {
	return setBanner('success', message);
}

export function addErrorBanner(message) {
	return setBanner('error', message || 'Something went boom :(');
}

export function addSocketBanner() {
	return setBanner('socket', 'Connection to the server has gone loco', true);
}

export function removeSocketBanner() {
	return (dispatch) => {
		dispatch({
			type: types.BANNER_REMOVE_SOCKET,
			payload: {show: false}
		});
	};
}
