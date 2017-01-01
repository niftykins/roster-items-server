export function up(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('instances', (table) => {
			table.increments();

			table.timestamp('created').notNullable().defaultTo(knex.fn.now());
			table.timestamp('updated').notNullable().defaultTo(knex.fn.now());

			table.string('wowId').notNullable().unique();
			table.string('name').notNullable();

			table.specificType('bosses', 'jsonb[]').notNullable();
		}),

		knex.schema.createTable('items', (table) => {
			table.increments();

			table.timestamp('created').notNullable().defaultTo(knex.fn.now());
			table.timestamp('updated').notNullable().defaultTo(knex.fn.now());

			table.string('wowId').notNullable().unique();
			table.string('name').notNullable();
			table.string('sourceId').notNullable();
			table.string('slot').notNullable();
			table.string('icon').notNullable();

			table.jsonb('allowed').notNullable();
		})
	]);
}

export function down(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('instances'),
		knex.schema.dropTable('items')
	]);
}
