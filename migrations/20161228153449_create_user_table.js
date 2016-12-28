export function up(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', (table) => {
			table.increments();

			table.timestamp('created').notNullable().defaultTo(knex.fn.now());
			table.timestamp('updated').notNullable().defaultTo(knex.fn.now());

			table.string('accountId').notNullable().unique();
			table.string('battletag').notNullable();
			table.string('token');
		})
	]);
}

export function down(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('users')
	]);
}
