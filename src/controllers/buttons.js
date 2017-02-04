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

import Buttons, {
	validateCreateInput,
	validateUpdateInput,
	validateDeleteInput
} from '../models/buttons';


async function fetchButtons() {
	const buttons = await Buttons.findAll();

	return buttons.map((i) => Buttons.transform(i));
}

async function createButton(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateCreateInput, raw);

	try {
		return Buttons.insert(value);
	} catch (e) {
		if (e.code && e.code === CODES.UNIQUE_VIOLATION) {
			throw new ApiError('An button with that ID already exists');
		}

		throw e;
	}
}

async function updateButton(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateUpdateInput, raw);

	const {id, ...data} = value;
	const result = await Buttons.update(id, data);
	requireResult(result);

	return result;
}

async function deleteButton(raw, context) {
	requireAuth(context);
	const value = requireValidation(validateDeleteInput, raw);

	const result = await Buttons.delete(value.id);
	requireResult(result);

	return result;
}

addSocketHandlers({
	[RPC.BUTTONS_FETCH]: fetchButtons,
	[RPC.BUTTON_CREATE]: createButton,
	[RPC.BUTTON_UPDATE]: updateButton,
	[RPC.BUTTON_DELETE]: deleteButton
});


// change feed
async function buttonFeedHandler({newRecord, oldRecord}) {
	const r = newRecord || oldRecord;

	return Buttons.transform(r);
}

addFeedHandler(Buttons.table, buttonFeedHandler);
