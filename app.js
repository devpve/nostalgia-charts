require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server started on port 3000");
});

// connect to mongodb
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Connected to db'))
  .catch((err) => console.log(err)); 

// middleware & static files
app.use(express.static('public'));

// use 3rd party middleware for logging
app.use(morgan('dev'));

// middleware to work with post requests
app.use(express.urlencoded( { extended: true } ));

// routes
app.get('/', (req, res) => {
  res.redirect('/index');
});

// other routes
//app.use('/blogs', blogRoutes);

// 404 page, use will fire for every request that wasn't run from the other options
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});