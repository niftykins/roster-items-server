// since knex always runs this file first, all of our seeds and migrations are babelified
require('babel-register');

require('./src/dotenv');

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			database: 'roster-items'
		},

		useNullAsDefault: true
	},
	production: {
		client: 'postgresql',
		connection: `${process.env.DATABASE_URL}?ssl=true`,
		useNullAsDefault: true
	}
};
