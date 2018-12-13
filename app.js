const express = require('express');
const exphbs  = require('express-handlebars');
//update the content middleware
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

 // Passport Config, (passport) is the parameter
require('./config/passport')(passport);


//Map global promise -get rid of warining
mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/story-dev')
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => console.log(err));




//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//How middleware works
app.use(function(req,res,next) {
    console.log(Date.now());
    req.name = 'May';
    next();
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
//   cookie: { secure: true }
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
//Set the user variable as global, when the user login in, the nav bar, information would change
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.get('/', (req, res) => {
   console.log(`namennmm ${req.name}`);
   res.render('index');
   console.log('INDEX')
});

app.get('/about', (req, res) => {
    res.render('about');
});




//test the delete router
// app.delete('/ideas/:id', (req, res) => {
//     res.send('delete');
// })

app.use('/ideas', ideas);
app.use('/users',users)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});