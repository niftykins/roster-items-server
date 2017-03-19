export function up(knex, Promise) {
	return Promise.all([
		knex.schema.table('users', (table) => {
			table.boolean('isItemsSuperAdmin').notNullable().defaultTo(false);
			table.boolean('isItemsAdmin').notNullable().defaultTo(false);
		})
	]);
}

export function down(knex, Promise) {
	return Promise.all([
		knex.schema.table('users', (table) => {
			table.dropColumns('isItemsAdmin', 'isItemsSuperAdmin');
		})
	]);
}
