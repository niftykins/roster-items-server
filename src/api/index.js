import 'babel-polyfill';

import 'isomorphic-fetch';

import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
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
		key: fs.readFileSync('./ssl/cert.key'),
		cert: fs.readFileSync('./ssl/cert.crt')
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


if (process.env.USE_REDIRECTS) {
	app.use((req, res, next) => {
		if (req.hostname === 'localhost') return next();
		if (req.hostname.includes('herokuapp')) {
			let url = process.env.URL;
			if (process.env.UI_PORT) url = `${url}:${process.env.UI_PORT}`;

			return res.redirect(url);
		}

		if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();

		res.redirect(`https://${req.hostname}${req.originalUrl}`);
		return null;
	});
}


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/test', (req, res) => {
	console.log(req.headers.cookie);

	res.json({ok: true});
});

if (process.env.LETS_ENCRYPT_URL) {
	app.get(`/.well-known/acme-challenge/${process.env.LETS_ENCRYPT_URL}`, (req, res) => {
		res.set('Content-Disposition', `attachment; filename="${process.env.LETS_ENCRYPT_URL}"`);
		res.send(process.env.LETS_ENCRYPT_CONTENT);
	});
}


// set up all the other handlers
setupBlizzardOAuth(app);
setupSocket(server, sessionParser);


const ui = path.join(__dirname, '..', 'ui');
app.use('/', express.static(ui));
app.get('/*', (req, res) => res.sendFile(path.join(ui, 'index.html')));

server.listen(PORT, () => {
	console.log(`API server is now running on port ${PORT}`);
});

