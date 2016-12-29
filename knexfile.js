// since knex always runs this file first, all of our seeds and migrations are babelified
require('babel-register');

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			database: 'roster-items'
		},

		useNullAsDefault: true
	}
};
