const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./db_connection');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const query = 'SELECT * FROM users WHERE email = ?';

        pool.query(query, [email], async (err, result) => {
            if (err) {
                return done(err)
            }
            if (result.length == 0) {
                return done(null, false, {message: 'No user'})
            }
            try {
                const user = result[0];
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else{
                    return done(null, false, {message: 'Password incorrect'})
                }
            } catch (error) {
                return done(error);
            }
        });
    };

    passport.use(new LocalStrategy ({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        pool.query('SELECT * FROM users WHERE id = ?', [id], (error, result) => {
            if (error) {
                return done(error);
            }
            if (result.length == 0) {
                return done(null, false, {message: 'No user'});
            }
            return done(null, result[0]);
        });
    });
}

module.exports = initialize;