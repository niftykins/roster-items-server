import express from 'express';
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

// run this early as other things use environment variables
import './dotenv';

import schema from './schema';

import setupBlizzardOAuth from './blizzardOAuth';

const PORT = process.env.PORT;
// const WS_PORT = process.env.WS_PORT;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
	allowedHeaders: ['Accept', 'Content-Type', 'Origin', 'X-CSRF'],
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
	origin: [/guildsy\.com.*/, /guildsy\.io.*/],
	credentials: true,
	maxAge: 3600
}));

setupBlizzardOAuth(app);

app.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
	const query = req.query.query || req.body.query;
	if (query && query.length > 2000) {
		throw new Error('Query too large');
	}

	console.log('gql', req.user, query);

	return {
		debug: true,
		schema,

		context: {
			user: req.user
		}
	};
}));

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql'
}));

app.listen(PORT, () => {
	console.log(`API server is now running on port ${PORT}`);
});
