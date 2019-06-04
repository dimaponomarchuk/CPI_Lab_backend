const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user = require('../db/models').user;

passport.use(new LocalStrategy(
    async (email, password, done) => {
        try {
            const user = await user.findOne({ where: { email }});
            if (!user) {
                return done(null, false)
            }
            if (password !== user.password ) {
                return done(null, false)
            }
            return done(null, user)
        } catch (err) {
            return done(err);
        }
    }
));
