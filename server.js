var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Initialize MongoDB connection
mongoose.connect('mongodb://localhost/oplfinalproject');
var db = mongoose.connection;

// Handle Mongo errors
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {});

// Use sessions for tracking logins
app.use(session({
  secret: 'schmeckledorf',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serving static files
app.use(express.static(__dirname + '/prod'));

// Include routes
var routes = require('./routes/router');
app.use('/', routes);

// Handle 404 error
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// Open server on port 8080
app.listen(8080, function () {
  console.log('Express app listening on port 8080');
});