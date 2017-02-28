var express = require('express');
var path = require('path');
var passport = require('passport');
var util = require('util')
var IntuitStrategy = require('passport-intuit-oauth').Strategy;
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var session = require('express-session')

var cookieParser = require('cookie-parser')
// var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var index = require('./routes/index');
var users = require('./routes/users');
var routes = require('./routes/index');
var invoiceRoute = require('./routes/invoice.js');
var docsRoute = require('./routes/docs.js');
var connect = require('./routes/oauth/connect');
var callback = require('./routes/oauth/callback');

var token = require('./conf/token.js');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Intuit profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  console.log('serialize: ' + JSON.stringify(user, null, 4))
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  console.log('deserialize: ' + JSON.stringify(obj, null, 4))
  done(null, obj);
});

// Use the IntuitStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
var hostName = 'localhost'
passport.use(new IntuitStrategy({
    consumerKey: token.consumer.key,
    consumerSecret: token.consumer.secret,
    callbackURL: "http://localhost:3000/auth/intuit/callback",
    returnURL: "http://localhost:3000/auth/intuit/callback"
  },
  function (oAuthToken, oAuthSecret, profile, done) {
    console.log("consumerKey: " + token.consumer.key)
    console.log("consumerSecret: " + token.consumer.secret)
    console.log("token: " + oAuthToken)
    console.log("tokenSecret: " + oAuthSecret)
    console.log('***' + JSON.stringify(profile, null, 3));
    return done(null, profile);
    // User.findOrCreate({
    //   intuitId: profile.id
    // }, function (err, user) {
    //   return done(err, user);
    // });
  }
));


// eventually resolve all of these issues with 
// keeping the entry point stored in web.config 
// 
process.chdir(__dirname);

var app = express();

var logger = function (req, res, next) {
  console.log("Request Received: " + req.method + ' ' + req.path);
  next(); // Passing the request to the next handler in the stack.
}
var addQboSettings = function (req, res, next) {

  // {
  //   oauth_token_secret: 'HMc06NZ8XcHGGnOIIx2t5eMpGtuJUQh5ur3nHyFv',
  //   oauth_token: 'qyprdYaKKtu5Bd1riEZ8PbxLX8FeaTDRGPh6Qgp6Ur6AqVH5',
  //   oauth_callback_confirmed: 'true'
  // }
  // Request Received: /callback/ {
  //   oauth_token_secret: 'lT6UHbslSEZXxGW2khARjj2ZKGpYEH1Ssz9x5rxr',
  //   oauth_token: 'lvprdPWqxtUv9Gd9CMFYO6CR6I6qElYWfQL1HJnveQuQ980Y'
  // }

  // req.session.qbo = {
  //   token: accessToken.oauth_token,
  //   secret: accessToken.oauth_token_secret,
  //   companyid: postBody.oauth.realmId
  // };
  // console.log("VALUES TO UPDATE ~30 DAYS: " + JSON.stringify(req.session.qbo))
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
    },
    date: function (value) {
      if (!value) {
        return "";
      }
      var date = new Date(value);

      return date.toLocaleDateString("en-US");

    },
    isHazardous: function (text) {
      return text.indexOf('HAZARDOUS') > -1 ? "*" : "";
    },
    removeParent: function (text) {
      if (text.indexOf(':') > -1) {
        return text.split(/[:]+/).pop()
      } else {
        return text;
      }

    }
  }
});

app.engine('handlebars', hbs.engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(cookieParser())
app.use(bodyParser());
app.use(methodOverride());
app.use(session({
  secret: 'keyboard cat'
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1']
// }))



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  console.log('...')
  console.log('/')
  // console.log(JSON.stringify(req.user));
  // console.log('render')
  return res.render('index', {
    token: {},
    user: req.user
  });
});
// app.use('/', index);
// app.use('/connect', connect);
// app.use('/callback', callback);
// app.use('/display', routes);
app.use('/invoice', invoiceRoute);
app.get('/auth/intuit', passport.authenticate('intuit'));

app.get('/auth/intuit/callback',
  passport.authenticate('intuit', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

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




// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login')
// }

module.exports = app;