import session from 'express-session';
import knexSessionStore from 'connect-session-knex';
import passport from 'passport';
import {Strategy as BlizzardStrategy} from 'passport-bnet';

import knex from './knex';
import Users from './models/users';

const store = new (knexSessionStore(session))({knex});

function makeClientUrl(path = '/') {
	return `${process.env.UI_URL}${path}`;
}

export default function setupBlizzardOAuth(app) {
	app.use(session({
		secret: 'samurai pizza penguins',
		saveUninitialized: false,
		resave: false,
		store
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/auth/bnet', passport.authenticate('bnet'));

	app.get('/auth/bnet/callback',
		passport.authenticate('bnet', {
			failureRedirect: makeClientUrl('/sign-in?error=1'),
			successRedirect: makeClientUrl('/sign-in')
		}));

	app.get('/auth/logout', (req, res) => {
		req.logout();
		res.json({ok: true});
	});
}

const bnetOptions = {
	callbackURL: `${process.env.API_URL}/auth/bnet/callback`,
	clientSecret: process.env.BNET_SECRET,
	clientID: process.env.BNET_ID,
	region: 'us'
};

async function bnetStrategyCallback(accessToken, refreshToken, profile, done) {
	try {
		const userId = await Users.upsertUser(profile);

		done(null, userId);
	} catch (e) {
		console.error(e);

		// XXX this doesn't actually indicate an error, just that the
		// auth failed - need to figure out what to do when there's
		// actually an error because just doing `done(e)` doesn't work
		done(null, false);
	}
}

passport.use(new BlizzardStrategy(bnetOptions, bnetStrategyCallback));

passport.serializeUser((userId, done) => done(null, userId));
passport.deserializeUser(async (userId, done) => {
	try {
		let user = await Users.findUserById(userId);
		console.log('deserializeUser', user);

		// false removes their session entry
		if (!user) user = false;

		done(null, user);
	} catch (e) {
		done(e, false);
	}
});
