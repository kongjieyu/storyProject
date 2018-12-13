const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load the model
//require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        console.log(email);
        console.log(password);
        //Match user
        User.findOne({
            email: email,
        }).then(user => {
            if(!user) {
                //for done(para1, para2), the first parameter is the err, since there's no err --- null, 
                //the second parameter is user, since there is no user --- false;
                return done(null, false, {message: "No User Found"});
                
            }
            //first password is the unhash password, the second password is the hash password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Password Incorrect"});
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

};
