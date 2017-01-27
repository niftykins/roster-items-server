import knex from '../knex';

class Instances {
	table = 'instances';

	async findById(id) {
		const items = await knex(this.table).where({id});
		return items[0];
	}

	findAll() {
		return knex(this.table).select();
	}

	insert(data) {
		return knex(this.table)
			.returning('*')
			.insert({
				bosses: data.bosses,
				wowId: data.wowId,
				name: data.name
			})
			.then(([row]) => row);
	}

	update(id, data) {
		return knex(this.table)
			.where({id})
			.returning('*')
			.update({
				bosses: data.bosses,
				wowId: data.wowId,
				name: data.name
			})
			.then(([r]) => r);
	}
}

export default new Instances();
