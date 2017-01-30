export function up(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('instances', (table) => {
			table.increments();

			table.timestamp('created').notNullable().defaultTo(knex.fn.now());
			table.timestamp('updated').notNullable().defaultTo(knex.fn.now());

			table.string('wowId').notNullable().unique();
			table.string('name').notNullable();

			table.string('release').notNullable();

			table.specificType('bosses', 'jsonb[]').notNullable();
			table.specificType('wowheadBonuses', 'jsonb').notNullable();
		})
	]);
}

export function down(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('instances')
	]);
}
