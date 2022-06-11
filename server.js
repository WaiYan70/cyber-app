const express = require('express');
const { pool } = require('./db.js');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig.js');

const app = express();
// set up our passport to use in the website
initializePassport(passport);

const  PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");

// Middle Ware
// send data details from our front end (register and login pages)
app.use(express.urlencoded({ extended : false }));

// session is used to store our user data details in the user session
app.use(
    session({
        // this a key which keep secret and it encrypt of information which is stored in sessions 
        secret: 'secret', 
        
        //save sessions varaible if nothing has change
        resave: false,

        // save session details if there has been no value placed in the session
        saveUninitialized: false
    })
);
// using passport is to authenticate requests using Stretegys
// To store logged in users sessions details into a broswer cookie, so user can use app as an authenticated user

// use initialize function from passportConfig.js
app.use(passport.initialize());
// use session to use in broswer
app.use(passport.session());

// flash is to flash messages when redirect to other pages
app.use(flash());

// Routes
app.get("/", (req , res) => {
    res.render("home");
});

app.get("/users/register", checkAuthenticated, (req , res) => {
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req , res) => {
    res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req , res) => {
    res.render("dashboard", { user: req.user.name });
});

  app.get("/users/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
        res.render("home", { message: "You have logged out successfully" });
    });
  });

//  use Post method to get rquest
app.post("/users/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
      });

    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({message: "Please enter all fields"});
    }
    if(password.length < 6){
        errors.push({message: "Password should be at 6 characters"});
    }
    if(password !== password2){
        errors.push({message: "Passwords do not match"})
    }
    // validation checks results in an error, return data into the login page with error array
    if(errors.length > 0){
        res.render("register", {errors})
    } else{
        // Form validation has passed
        let hashedPassword = await bcrypt.hash(password, 10); // amount of word of encryption which password is hashed
        console.log(`Password : ${password}`);
        console.log(`HashedPassword: ${hashedPassword}`);

        pool.query(
            // email = $1 will be repleaced by the variable when it pass
            `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
                if (err) {
                  console.log(err);
                }
                console.log(results.rows);
                // the users is already in database
                if(results.rows.length > 0){
                    errors.push({message: "Email is already registered"});
                    res.render('register', {errors});
                }else{
                    // there is no data database, user registers data into database 
                    pool.query(
                        `INSERT INTO users (name, email, password) 
                         VALUES ($1, $2, $3) 
                         RETURNING id, password`, [name, email, hashedPassword], (err, results)=>{
                             if(err){
                                 console.log(err);
                             }
                             console.log(results.rows);
                             req.flash("success_msg", "You are now registered Successfully. Please Log in");
                             res.redirect("/users/login");
                         }
                    )
                }
            }
        );
    }
} );
//condition after registeration to redirecting dashboard page or login page depend on condition
app.post("/users/login", passport.authenticate('local', {
        successRedirect : "/users/dashboard", 
        failureRedirect: "/users/login",
        failureFlash: true
    })
);

// if they are logged in and authenticated, then it will be redirect to the dashboard
// check if user authenticated 
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}
//if user tried to visit the dashboard , users are not logged and it will be direct to the login page
function checkNotAuthenticated (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

// server lister on 4000 port 
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
