const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./db.js');
const bcrypt = require('bcrypt');

// initialize the local stretegy
function initialize(passport){
    // query database to see if the email and password exists
    const authenticateUser = (email,password, done) => {
        pool.query(
            `SELECT * FROM users WHERE email = $1` , [email], (err, results) => {
                if(err){
                    console.log(err);
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    // it will pass in the user obejct to the "results.row" from database
                    const user = results.rows[0];
                    //  compare the password that users place in the input form in the Login Page with password in the database
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }

                        // if there is no error
                        // done functon will store and return to the user and store data in the session cookie object
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            // the password doesn't match, it will display error message 
                            return done(null, false, {message: "Password is not correct"});
                        }
                    });
                } else {
                    // there are no user found in the database, it will show the error message
                    return done(null, false, {message: "Email is not registered"});
                }
            }
        );
    };
    
    //
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, authenticateUser));
    // to store the user id in the sessions
    passport.serializeUser((user, done) => done(null, user.id));
    // contain the user detail from the database and sort object into the session when navigate our pages
    passport.deserializeUser((id,done) => {
        pool.query(
            `SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
                if(err){
                    console.log(err);
                }
                return done (null, results.rows[0]);
        });
    });
}

module.exports = initialize;