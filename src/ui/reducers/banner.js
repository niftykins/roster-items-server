import {Record, List} from 'immutable';

import * as types from '../constants/types';

const Banner = Record({
	id: null,

	message: null,
	type: null
});

function removeSocketBanners(state) {
	return state.filter((b) => b.type !== 'socket');
}

function hasSocketBanner(state) {
	return state.find((b) => b.type === 'socket');
}

export default function banner(state = new List(), action) {
	switch (action.type) {
		case types.BANNER_ADD:
			// don't add multiple socket banners
			if (action.payload.type === 'socket' && hasSocketBanner(state)) {
				return state;
			}

			return state.push(new Banner(action.payload));

		case types.BANNER_REMOVE:
			return state.filter((b) => b.id !== action.payload.id);

		case types.BANNER_REMOVE_SOCKET:
			return removeSocketBanners(state);

		default: return state;
	}
}

export function getBanner(state) {
	return state.last();
}
