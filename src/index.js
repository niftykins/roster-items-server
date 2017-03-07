import 'isomorphic-fetch';

import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import knexSessionStore from 'connect-session-knex';

// run this early as other things use environment variables
import './dotenv';

import knex from './knex';

// add all the controllers
import './controllers';

// boot up the changefeed
import './changefeed';

import setupBlizzardOAuth from './blizzardOAuth';
import setupSocket from './socket';


const PORT = process.env.PORT;
// const WS_PORT = process.env.WS_PORT;

const app = express();
let server;
if (process.env.USE_SSL_LOCALLY) {
	const sslOpts = {
		key: fs.readFileSync('./ssl/server.key.pem'),
		cert: fs.readFileSync('./ssl/server.crt.pem')
	};
	server = https.createServer(sslOpts, app);
} else {
	server = http.createServer(app);
}


// set up session
const KnexStore = knexSessionStore(session);
const store = new KnexStore({knex});
const sessionParser = session({
	secret: 'samurai pizza penguins',
	saveUninitialized: false,
	resave: false,
	store
});
app.use(sessionParser);


// set up cors
app.use(cors({
	allowedHeaders: ['Accept', 'Content-Type', 'Origin', 'X-CSRF'],
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
	origin: [/guildsy\.com.*/, /guildsy\.io.*/],
	credentials: true,
	maxAge: 3600
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
	console.log(req.headers.cookie);

	res.json({ok: true});
});

server.listen(PORT, () => {
	const ssl = process.env.USE_SSL_LOCALLY ? ' using SSL' : '';
	console.log(`API server is now running on port ${PORT}${ssl}`);
});


// set up all the other handlers
setupBlizzardOAuth(app);
setupSocket(server, sessionParser);
