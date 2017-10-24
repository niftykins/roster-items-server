import * as types from '../constants/types';

import {addErrorBanner} from './banners';

export function fetchUser(isRefetch) {
	return (dispatch, getState, api) => {
		dispatch({
			type: isRefetch ? types.SELF_FETCH_REFETCH : types.SELF_FETCH_REQUEST
		});

		api.call(types.RPC_SELF_FETCH).then(
			(message) => {
				dispatch({
					type: types.SELF_FETCH_SUCCESS,
					payload: {user: message.data}
				});
			},

			(message) => {
				dispatch({type: types.SELF_FETCH_FAILURE});

				dispatch(addErrorBanner(message.error));
			}
		);
	};
}

export function login() {
	return () => {
		window.location.href = '/api/auth/bnet';
	};
}

export function logout() {
	return (dispatch, getState, api) => {
		api.callHTTP('/auth/logout').then(({ok}) => {
			if (ok) dispatch({type: types.SELF_LOGOUT_SUCCESS});
		});
	};
}
