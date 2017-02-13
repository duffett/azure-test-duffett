var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

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
var addQboSettings = function (req, res, next) {



  req.session.qbo = {
    token: accessToken.oauth_token,
    secret: accessToken.oauth_token_secret,
    companyid: postBody.oauth.realmId
  };
  next(); // Passing the request to the next handler in the stack.
}

app.use(logger); // Here you add your logger to the stack.

var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    if_eq: function (a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
    json: function (context) {
      return JSON.stringify(context, null, 4);
    }
  }
});

app.engine('handlebars', hbs.engine);

// view engine setup
app.set('views', path.join('.', '/views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}))



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