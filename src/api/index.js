import 'isomorphic-fetch';

import https from 'https';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
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
const sslOpts = {
	key: fs.readFileSync('./ssl/cert.key'),
	cert: fs.readFileSync('./ssl/cert.crt')
};
const server = https.createServer(sslOpts, app);


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
// app.use(cors({
// 	allowedHeaders: ['Accept', 'Content-Type', 'Origin', 'X-CSRF'],
// 	methods: ['GET', 'PUT', 'POST', 'DELETE'],
// 	origin: [/guildsy\.com.*/, /guildsy\.io.*/],
// 	credentials: true,
// 	maxAge: 3600
// }));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
	console.log(req.headers.cookie);

	res.json({ok: true});
});

if (process.env.LETS_ENCRYPT_URL) {
	app.get(process.env.LETS_ENCRYPT_URL, (req, res) => {
		res.send(process.env.LETS_ENCRYPT_CONTENT);
	});
}

server.listen(PORT, () => {
	console.log(`API server is now running on port ${PORT}`);
});


// set up all the other handlers
setupBlizzardOAuth(app);
setupSocket(server, sessionParser);
