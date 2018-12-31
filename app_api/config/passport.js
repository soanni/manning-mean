const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

passport.use(new LocalStrategy({usernameField: 'email'},(username, password, done) => {
	User.findOne({email: username}, (err, user) => {
		if(err) {
			return done(err);
		}
		if(!user) {
			return done(null, false, {
				message: 'Incorrect username.'
			});
		}
		if(!user.validPassword(password)) {
			return done(null, false, {
				message: 'Incorrect password.'
			});
		}
		return done(null, user);
	});
}));

