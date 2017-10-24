import pick from 'lodash/pick';
import joi from 'joi';

import knex from '../knex';

import {ROLES, CLASSES} from '../constants/wow';

import {validate, rules} from '../helpers/validation';


class Items {
	table = 'items';

	findAll() {
		return knex(this.table).select();
	}

	insert(data) {
		return knex(this.table)
			.returning('*')
			.insert({
				allowed: data.allowed,

				sourceId: data.sourceId,
				wowId: data.wowId,
				name: data.name,
				slot: data.slot,

				icon: data.icon
			})
			.then(([r]) => r);
	}

	update(id, data) {
		return knex(this.table)
			.where({id})
			.returning('*')
			.update({
				allowed: data.allowed,

				sourceId: data.sourceId,
				wowId: data.wowId,
				name: data.name,
				slot: data.slot,

				icon: data.icon
			})
			.then(([r]) => r);
	}

	delete(id) {
		return knex(this.table)
			.where({id})
			.returning('*')
			.delete()
			.then(([r]) => r);
	}

	transform(item) {
		return pick(item, [
			'id',

			'sourceId',
			'wowId',
			'name',
			'slot',

			'allowed'
		]);
	}
}

export default new Items();


// schemas

const arrayOfClasses = joi.array()
	.items(joi.string().valid(Object.values(CLASSES)))
	.min(0)
	.max(12)
	.unique();

const createSchema = joi.object().keys({
	sourceId: rules.string,
	wowId: rules.string,
	name: rules.string,
	slot: rules.string,

	allowed: joi.object()
		.keys({
			[ROLES.MELEE]: arrayOfClasses,
			[ROLES.RANGED]: arrayOfClasses,
			[ROLES.HEALERS]: arrayOfClasses,
			[ROLES.TANKS]: arrayOfClasses
		})
});

const updateSchema = createSchema.keys({
	id: rules.id
});

const deleteSchema = joi.object().keys({
	id: rules.id
});

const autofillSchema = joi.object().keys({
	url: joi.string()
});

export function validateCreateInput(data) {
	return validate(createSchema, data);
}

export function validateUpdateInput(data) {
	return validate(updateSchema, data);
}

export function validateDeleteInput(data) {
	return validate(deleteSchema, data);
}

export function validateAutofillInput(data) {
	return validate(autofillSchema, data);
}
