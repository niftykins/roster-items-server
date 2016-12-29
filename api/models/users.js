import knex from '../knex';

class Users {
	table = 'users'

	async findUserById(id) {
		const users = await knex(this.table).where({id});
		return users[0];
	}

	async findUserByAccountId(accountId) {
		const users = await knex(this.table).where({accountId});
		return users[0];
	}

	async upsertUser({id: accountId, battletag, token}) {
		const user = await this.findUserByAccountId(accountId);

		// there's already a user so just update the token
		if (user) {
			await knex(this.table).where({id: user.id}).update({
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
			.then(([id]) => id);
	}
}

export default new Users();
