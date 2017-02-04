import pick from 'lodash/pick';
import joi from 'joi';

import knex from '../knex';

import {ROLES, CLASSES} from '../constants/wow';

import {validate, rules} from '../helpers/validation';


class Buttons {
	table = 'buttons';

	findAll() {
		return knex(this.table).select();
	}

	insert(data) {
		return knex(this.table)
			.returning('*')
			.insert({
				select: data.select,

				order: data.order,
				name: data.name
			})
			.then(([r]) => r);
	}

	update(id, data) {
		return knex(this.table)
			.where({id})
			.returning('*')
			.update({
				select: data.select,

				order: data.order,
				name: data.name
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

	transform(button) {
		return pick(button, [
			'id',

			'order',
			'name',

			'select'
		]);
	}
}

export default new Buttons();


// schemas

const arrayOfClasses = joi.array()
	.items(joi.string().valid(Object.values(CLASSES)))
	.min(0)
	.max(12)
	.unique();

const createSchema = joi.object().keys({
	order: joi.number().integer(),
	name: rules.string,

	select: joi.object()
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

export function validateCreateInput(data) {
	return validate(createSchema, data);
}

export function validateUpdateInput(data) {
	return validate(updateSchema, data);
}

export function validateDeleteInput(data) {
	return validate(deleteSchema, data);
}
