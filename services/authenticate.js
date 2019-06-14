const LocalStrategy = require('passport-local').Strategy;
const user = require('../db/models').user;
const sha512 = require('crypto-js/hmac-sha512');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const result = await user.findOne({ where: { email }});
                if (!result) {
                    return done(null, false)
                }
                if (password !== result.password ) {
                    return done(null, false)
                }
                return done(null, result)
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser(async (user_id, done) => {
        await user.findOne({where: {user_id}}).then((user) => {
            done(null, user);
            return null;
        });
    });
};
