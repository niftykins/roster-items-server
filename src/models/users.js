import pick from 'lodash/pick';

import knex from '../knex';

const publicFields = ['id', 'accountId', 'battletag'];
const selfFields = [...publicFields, 'isItemsAdmin', 'isItemsSuperAdmin'];

class Users {
	table = 'users'

	async findById(id) {
		const users = await knex(this.table).where({id});
		return users[0];
	}

	async findByAccountId(accountId) {
		const users = await knex(this.table).where({accountId});
		return users[0];
	}

	async upsert({id: accountId, battletag, token}) {
		const user = await this.findByAccountId(accountId);

		// there's already a user so just update the info
		if (user) {
			await knex(this.table).where({id: user.id}).update({
				battletag,
				token
			});

			return user.id;
		}

		return knex(this.table)
			.returning('id')
			.insert({
				accountId,
				battletag,
				token
			})
			.then(([r]) => r);
	}


	// transformation helpers

	// transformToPublic(user) {
	// 	return pick(user, publicFields);
	// }

	transformToSelf(user) {
		return pick(user, selfFields);
	}
}

export default new Users();
