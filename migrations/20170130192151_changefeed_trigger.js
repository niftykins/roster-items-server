import {
	createChangefeedTrigger,
	dropChangefeedTrigger
} from '../migrationHelpers';

const triggerFunction = `
	CREATE OR REPLACE FUNCTION notify_changes() RETURNS trigger AS $$
	DECLARE
	BEGIN
	  IF TG_OP = 'INSERT' THEN
	    PERFORM pg_notify(
	    	'changefeed',
	    	json_build_object(
	    		'table', TG_TABLE_NAME,
	    		'type', TG_OP,
	    		'newRecord', row_to_json(NEW)
	    	)::text
	    );

	    RETURN NEW;

	  ELSIF TG_OP = 'UPDATE' THEN
	    PERFORM pg_notify(
	    	'changefeed',
	    	json_build_object(
	    		'table', TG_TABLE_NAME,
	    		'type', TG_OP,
	    		'oldRecord', row_to_json(OLD),
	    		'newRecord', row_to_json(NEW)
	    	)::text
	    );

	    RETURN NEW;

	  ELSIF TG_OP = 'DELETE' THEN
	    PERFORM pg_notify(
	    	'changefeed',
	    	json_build_object(
	    		'table', TG_TABLE_NAME,
	    		'type', TG_OP,
	    		'oldRecord', row_to_json(OLD)
	    	)::text
	    );

	    RETURN OLD;

	  END IF;
	END;
	$$ LANGUAGE plpgsql;
`;

export function up(knex, Promise) {
	return knex.raw(triggerFunction).then(() => Promise.all([
		knex.raw(createChangefeedTrigger('users')),
		knex.raw(createChangefeedTrigger('instances'))
	]));
}

export function down(knex, Promise) {
	return Promise.all([
		knex.raw(dropChangefeedTrigger('users')),
		knex.raw(dropChangefeedTrigger('instances'))
	]);
}
