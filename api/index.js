// import path from 'path';
import express from 'express';
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import './dotenv';

import schema from './schema';

import {setupBlizzardLogin, setupBlizzardPassport} from './blizzardLogin';

const PORT = process.env.PORT || 8080;
process.env.PORT = PORT;

// const WS_PORT = process.env.WS_PORT || 8090;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
	origin: [/guildsy\.com.*/],
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
	credentials: true,
	allowedHeaders: ['Accept', 'Content-Type', 'Origin', 'X-CSRF']
}));

setupBlizzardPassport();
setupBlizzardLogin(app);

app.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
	const query = req.query.query || req.body.query;
	if (query && query.length > 2000) {
		throw new Error('Query too large');
	}

	// let user;
	console.log('gql', req.user, query);

	return {
		context: {},
		debug: true,
		schema
	};
}));

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql'
}));

app.listen(PORT, () => {
	console.log(`API server is now running on port ${PORT}`);
});
