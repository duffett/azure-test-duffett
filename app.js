var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var session = require('express-session')

var index = require('./routes/index');
var users = require('./routes/users');
var routes = require('./routes/index');
var invoiceRoute = require('./routes/invoice.js');
var connect = require('./routes/oauth/connect');
var callback = require('./routes/oauth/callback');


var app = express();

var logger = function (req, res, next) {
  console.log("Request Received: " + req.path);
  next(); // Passing the request to the next handler in the stack.
}

app.use(logger); // Here you add your logger to the stack.


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'smith'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/connect', connect);
app.use('/callback', callback);
app.use('/display', routes);
app.use('/invoice', invoiceRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;