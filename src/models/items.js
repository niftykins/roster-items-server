import knex from '../knex';

class Items {
	table = 'items';

	async findById(id) {
		const items = await knex(this.table).where({id});
		return items[0];
	}

	async findAll() {
		return knex(this.table).select();
	}
}

export default new Items();
