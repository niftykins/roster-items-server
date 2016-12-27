import session from 'express-session';
import jsonSessionStore from 'express-session-json';
import passport from 'passport';
import {Strategy as BlizzardStrategy} from 'passport-bnet';

const store = new (jsonSessionStore(session))({
	filename: '.sessions',
	path: __dirname
});

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

passport.use(new BlizzardStrategy(bnetOptions, (accessToken, refreshToken, profile, done) => {
	console.log('User:', JSON.stringify(profile, null, 3));

	done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
