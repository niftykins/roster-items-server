import * as fromSocket from '../reducers/socket';
import * as fromBanner from '../reducers/banner';

import * as fromUser from '../reducers/user';
import * as fromButtons from '../reducers/buttons';
import * as fromInstances from '../reducers/instances';
import * as fromItems from '../reducers/items';

export const getUser = (state) => fromUser.getUser(state.user);

export const getSocketStatus = (state) => fromSocket.getSocketStatus(state.socket);

export const getBanner = (state) => fromBanner.getBanner(state.banner);


export const getButton = (state, id, useForm) => (
	fromButtons.getButton(state.buttons, id, useForm)
);
export const getButtons = (state) => (
	fromButtons.getButtons(state.buttons)
);
export const getButtonsLoading = (state) => (
	fromButtons.getLoading(state.buttons)
);
export const getButtonsError = (state) => (
	fromButtons.getError(state.buttons)
);


export const getInstance = (state, id, useForm) => (
	fromInstances.getInstance(state.instances, id, useForm)
);
export const getInstances = (state) => (
	fromInstances.getInstances(state.instances)
);
export const getInstancesLoading = (state) => (
	fromInstances.getLoading(state.instances)
);
export const getInstancesError = (state) => (
	fromInstances.getError(state.instances)
);


export const getItem = (state, id, useForm) => (
	fromItems.getItem(state.items, id, useForm)
);
export const getItems = (state) => (
	fromItems.getItems(state.items)
);
export const getItemsSearch = (state) => (
	fromItems.getSearch(state.items)
);
export const getItemsLoading = (state) => (
	fromItems.getLoading(state.items)
);
export const getItemsError = (state) => (
	fromItems.getError(state.items)
);
