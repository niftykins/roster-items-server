import {createChangefeedTrigger} from '../migrationHelpers';


export function up(knex) {
	return knex.schema.createTable('items', (table) => {
		table.increments();

		table.timestamp('created').notNullable().defaultTo(knex.fn.now());
		table.timestamp('updated').notNullable().defaultTo(knex.fn.now());

		table.string('wowId').notNullable().unique();
		table.string('name').notNullable();
		table.string('sourceId').notNullable();
		table.string('slot').notNullable();

		table.specificType('icon', 'text').notNullable();

		table.specificType('allowed', 'jsonb').notNullable();
	})
		.then(() => knex.raw(createChangefeedTrigger('items')));
}

export function down(knex) {
	return knex.schema.dropTable('items');
}
