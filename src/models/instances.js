import pick from 'lodash/pick';
import joi from 'joi';

import knex from '../knex';

import {DIFFICULTIES} from '../constants/wow';

import {validate, rules} from '../helpers/validation';


class Instances {
	table = 'instances';

	findAll() {
		return knex(this.table).select();
	}

	insert(data) {
		return knex(this.table)
			.returning('*')
			.insert({
				wowheadBonuses: data.wowheadBonuses,
				bosses: data.bosses,

				released: data.released,
				wowId: data.wowId,
				name: data.name
			})
			.then(([r]) => r);
	}

	update(id, data) {
		return knex(this.table)
			.where({id})
			.returning('*')
			.update({
				wowheadBonuses: data.wowheadBonuses,
				bosses: data.bosses,

				released: data.released,
				wowId: data.wowId,
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

	transform(instance) {
		return pick(instance, [
			'id',

			'wowId',
			'name',
			'released',

			'bosses',
			'wowheadBonuses'
		]);
	}
}

export default new Instances();


// schemas

const createSchema = joi.object().keys({
	wowId: rules.string,
	name: rules.string,

	released: rules.numberString,

	wowheadBonuses: joi.object()
		.keys({
			[DIFFICULTIES.NORMAL]: rules.numberString,
			[DIFFICULTIES.HEROIC]: rules.numberString,
			[DIFFICULTIES.MYTHIC]: rules.numberString
		}),

	bosses: joi.array()
		.items(joi.object().keys({
			wowId: rules.string,
			name: rules.string
		}))
		.min(1)
		.max(20)
		.unique('wowId')
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
