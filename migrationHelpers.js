export function createChangefeedTrigger(table) {
	return `
		DROP TRIGGER IF EXISTS changefeed ON ${table};
		CREATE TRIGGER changefeed AFTER INSERT OR UPDATE OR DELETE ON ${table} FOR EACH ROW EXECUTE PROCEDURE notify_changes();
	`;
}

export function dropChangefeedTrigger(table) {
	return `DROP TRIGGER IF EXISTS changefeed ON ${table}`;
}


export function createUpdatedTrigger(table) {
	return `
		DROP TRIGGER IF EXISTS bump_updated ON ${table};
		CREATE TRIGGER bump_updated BEFORE UPDATE ON ${table} FOR EACH ROW EXECUTE PROCEDURE bump_updated();
	`;
}

export function dropUpdatedTrigger(table) {
	return `DROP TRIGGER IF EXISTS bump_updated ON ${table}`;
}
