// import querystring from 'querystring';
import passport from 'passport';
import {Strategy as BlizzardStrategy} from 'passport-bnet';

import Users from './models/users';

// const BNET_OAUTH_URL = 'https://us.battle.net/oauth';

function makeClientUrl(path = '/') {
	let url = process.env.UI_URL;

	if (process.env.UI_PORT) url = `${url}:${process.env.UI_PORT}`;
	return `${url}${path}`;
}

export default function setupBlizzardOAuth(app) {
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/api/auth/bnet', passport.authenticate('bnet'));

	app.get('/api/auth/bnet/callback',
		passport.authenticate('bnet', {
			failureRedirect: makeClientUrl('/sign-in?error=1'),
			successRedirect: makeClientUrl('/')
		}));

	app.get('/api/auth/logout', (req, res) => {
		req.logout();
		res.json({ok: true});
	});
}

const bnetOptions = {
	callbackURL: '/api/auth/bnet/callback',
	clientSecret: process.env.BNET_SECRET,
	clientID: process.env.BNET_ID,
	scope: ['wow.profile'],
	region: 'us'
};

async function bnetStrategyCallback(accessToken, refreshToken, profile, done) {
	try {
		const userId = await Users.upsert(profile);

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
		let user = await Users.findById(userId);
		console.log('deserializeUser', user && user.id);

		// false removes their session entry
		if (!user) user = false;

		done(null, user);
	} catch (e) {
		done(e);
	}
});
