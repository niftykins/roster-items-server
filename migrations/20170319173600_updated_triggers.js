import {
	createUpdatedTrigger,
	dropUpdatedTrigger
} from '../migrationHelpers';

const triggerFunction = `
	CREATE OR REPLACE FUNCTION bump_updated() RETURNS trigger as $$
	BEGIN
		NEW.updated = now();
		RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;
`;

export function up(knex, Promise) {
	return knex.raw(triggerFunction).then(() => Promise.all([
		knex.raw(createUpdatedTrigger('buttons')),
		knex.raw(createUpdatedTrigger('instances')),
		knex.raw(createUpdatedTrigger('items')),
		knex.raw(createUpdatedTrigger('users'))
	]));
}

export function down(knex, Promise) {
	return Promise.all([
		knex.raw(dropUpdatedTrigger('buttons')),
		knex.raw(dropUpdatedTrigger('instances')),
		knex.raw(dropUpdatedTrigger('items')),
		knex.raw(dropUpdatedTrigger('users'))
	]);
}
