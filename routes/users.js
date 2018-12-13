const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/User');
const User = mongoose.model('users');

//User Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});


//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
         errors.push({text: 'Password do not match'});
    }
    if(req.body.password != req.body.password2){
         errors.push({text: 'Password must be at least 4 characters'});
    }
    if(errors.length > 0){
        //pass some stuff here
         res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
         });
    } else {
        User.findOne({
            email: req.body.email,
        }) 
            .then(user => {
                //if theere is a user with that email; Notice: only put the user inside the parathesis
                if(user){
                    req.flash('error_msg', 'Email already registered')
                    res.redirect('/users/login');
                } else{
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            // Store hash in your password DB.
                            if(err) throw err;
                            newUser.password = hash;
                            new User(newUser)
                                .save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now register and can login');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        });
                    });
                }
            })


    }
})

//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
});


module.exports = router;