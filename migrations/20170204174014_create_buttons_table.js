import {createChangefeedTrigger} from '../migrationHelpers';


export function up(knex) {
	return knex.schema.createTable('buttons', (table) => {
		table.increments();

		table.timestamp('created').notNullable().defaultTo(knex.fn.now());
		table.timestamp('updated').notNullable().defaultTo(knex.fn.now());

		table.string('name').notNullable();
		table.integer('order').notNullable();

		table.specificType('select', 'jsonb').notNullable();
	})
		.then(() => knex.raw(createChangefeedTrigger('buttons')));
}

export function down(knex) {
	return knex.schema.dropTable('buttons');
}
