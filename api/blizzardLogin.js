import session from 'express-session';
import jsonSessionStore from 'express-session-json';
import passport from 'passport';
import {Strategy as BlizzardStrategy} from 'passport-bnet';

const store = new (jsonSessionStore(session))({
	path: __dirname,
	filename: '.sessions'
});

function makeClientUrl(path = '/') {
	return `http://local.guildsy.com:3000${path}`;
}

export function setupBlizzardLogin(app) {
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
		passport.authenticate('bnet', {failureRedirect: makeClientUrl('/failed')}),
		(req, res) => {
			console.log('cb handler', req.user);
			res.redirect(makeClientUrl('/sign-in'));
		});

	app.get('/auth/logout', (req, res) => {
		req.logout();
		res.redirect(makeClientUrl('/'));
	});
}

export function setupBlizzardPassport() {
	const bnetOptions = {
		callbackURL: 'https://busybot2.ngrok.io/auth/bnet/callback',
		clientSecret: process.env.BNET_SECRET,
		clientID: process.env.BNET_ID,
		region: 'us'
	};

	passport.use(new BlizzardStrategy(bnetOptions, (accessToken, refreshToken, profile, cb) => {
		console.log('User:', JSON.stringify(profile, null, 3));

		cb(null, profile);
	}));

	passport.serializeUser((user, cb) => cb(null, user));
	passport.deserializeUser((obj, cb) => cb(null, obj));
}
