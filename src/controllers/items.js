import xml2json from 'xml2json';

import {addFeedHandler} from '../changefeed';
import {addSocketHandlers} from '../socket';

import CODES from '../constants/codes';
import RPC from '../constants/rpc';

import ApiError from '../helpers/ApiError';

import {
	requireAuth,
	requireItemsAdmin,
	requireValidation,
	requireResult
} from './middleware';

import Items, {
	validateAutofillInput,
	validateCreateInput,
	validateUpdateInput,
	validateDeleteInput
} from '../models/items';


function toJson(xml) {
	return xml2json.toJson(xml, {
		alternateTextNode: 'value',
		object: true
	});
}

async function getWowheadIcon(icon) {
	const url = `http://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;

	const data = await fetch(url)
		.then(async (r) => ({
			type: r.headers.get('content-type'),
			value: await r.buffer()
		}))
		.then((d) => (
			`data:${d.type};base64,${d.value.toString('base64')}`
		))
		.catch(() => false);

	if (!data) {
		throw new ApiError('Error fetching item icon');
	}

	return data;
}

async function getWowheadItem(id, isPtr, crash) {
	const subdomain = isPtr ? 'ptr' : 'www';

	const url = `http://${subdomain}.wowhead.com/item=${id}?xml`;

	const data = await fetch(url)
		.then((r) => r.text())
		.then((xml) => toJson(xml))
		.catch(() => false);

	if (!data || !data.wowhead || !data.wowhead.item) {
		if (crash) throw new ApiError('Error fetching item');

		// XXX retry logic is largely untested due to wowhead
		// having a bunch of redirects making it hard to get
		// bad data from pages that actually exist

		// retry the call with the other subdomain
		return getWowheadItem(id, !isPtr, true);
	}


	const item = data.wowhead.item;
	const result = {
		icon: item.icon.value,
		name: item.name,
		id: item.id,

		slot: {
			name: item.inventorySlot.value,
			id: item.inventorySlot.id
		},

		class: {
			name: item.class.value,
			id: item.class.id
		},

		subclass: {
			name: item.subclass.value,
			id: item.subclass.id
		}
	};

	// attempt to find the name of the boss who drops this
	const sourceRegex = /dropped by: ([^<]+)?</i;
	const sourceMatches = sourceRegex.exec(item.htmlTooltip || '');
	if (sourceMatches && sourceMatches[1]) {
		result.sourceName = sourceMatches[1];
	}

	return result;
}


async function fetchItems() {
	const items = await Items.findAll();

	return items.map((i) => Items.transform(i));
}

async function createItem(raw, context) {
	requireAuth(context);
	requireItemsAdmin(context);
	const value = requireValidation(validateCreateInput, raw);

	try {
		const item = await getWowheadItem(value.wowId, false);
		value.icon = await getWowheadIcon(item.icon);

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
	requireItemsAdmin(context);
	const value = requireValidation(validateUpdateInput, raw);

	const {id, ...data} = value;

	const item = await getWowheadItem(value.wowId, false);
	data.icon = await getWowheadIcon(item.icon);

	const result = await Items.update(id, data);
	requireResult(result);

	return result;
}

async function deleteItem(raw, context) {
	requireAuth(context);
	requireItemsAdmin(context);
	const value = requireValidation(validateDeleteInput, raw);

	const result = await Items.delete(value.id);
	requireResult(result);

	return result;
}

async function autofillItem(raw, context) {
	requireAuth(context);
	requireItemsAdmin(context);
	const value = requireValidation(validateAutofillInput, raw);

	const urlRegex = /^https?:\/\/(ptr|www).wowhead.com\/item=(\d+).*/;
	const matches = urlRegex.exec(value.url);

	if (!matches || !matches[2]) {
		throw new ApiError('That wowhead url seems bad');
	}

	const isPtr = matches[1] === 'ptr';
	return getWowheadItem(matches[2], isPtr);
}

addSocketHandlers({
	[RPC.ITEMS_FETCH]: fetchItems,
	[RPC.ITEM_CREATE]: createItem,
	[RPC.ITEM_UPDATE]: updateItem,
	[RPC.ITEM_DELETE]: deleteItem,

	[RPC.ITEM_AUTOFILL]: autofillItem
});


// change feed
async function itemFeedHandler({newRecord, oldRecord}) {
	const r = newRecord || oldRecord;

	return Items.transform(r);
}

addFeedHandler(Items.table, itemFeedHandler);
