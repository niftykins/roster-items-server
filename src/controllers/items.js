import {addFeedHandler} from '../changefeed';
import {addSocketHandlers} from '../socket';

import CODES from '../constants/codes';
import RPC from '../constants/rpc';

import ApiError from '../helpers/ApiError';

import {
	requireAuth,
	requireValidation,
	requireResult
} from './middleware';

import Items, {
	validateCreateInput,
	validateUpdateInput,
	validateDeleteInput
} from '../models/items';


async function fetchItems() {
	const items = await Items.findAll();

	return items.map((i) => Items.transform(i));
}

async function createItem(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateCreateInput, raw);

	try {
		return Items.insert(value);
	} catch (e) {
		if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
			throw new ApiError('An item with that ID already exists');
		}

		throw e;
	}
}

async function updateItem(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateUpdateInput, raw);

	const {id, ...data} = value;
	const result = await Items.update(id, data);
	requireResult(result);

	return result;
}

async function deleteItem(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateDeleteInput, raw);

	const result = await Items.delete(value.id);
	requireResult(result);

	return result;
}

addSocketHandlers({
	[RPC.ITEMS_FETCH]: fetchItems,
	[RPC.ITEM_CREATE]: createItem,
	[RPC.ITEM_UPDATE]: updateItem,
	[RPC.ITEM_DELETE]: deleteItem
});


// change feed
async function itemFeedHandler({newRecord, oldRecord}) {
	const r = newRecord || oldRecord;

	return Items.transform(r);
}

addFeedHandler(Items.table, itemFeedHandler);
