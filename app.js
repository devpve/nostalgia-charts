const path = require('path');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv'); 
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const ejs = require('ejs');

// Load config
dotenv.config( { path: './config/config.env' } );

// Passport config
require('./config/passport')(passport);

// connect to mongodb
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Connected to db'))
  .catch((err) => console.log(err)); 

// express app
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// register view engine
app.set('view engine', 'ejs');

// Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to work with post requests
app.use(express.urlencoded( { extended: true } ));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server started on port 3000");
});

// 404 page, use will fire for every request that wasn't run from the other options
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});