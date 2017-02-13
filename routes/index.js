var express = require('express');
var router = express.Router();
var config = require('../conf/settings.js')
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("GRANT URL PORT: " + config.Port)
  var serverPath = 'http://' + req.get('host');
  // var grantUrl = 'http://localhost:' + config.Port + '/connect';
  var grantUrl = serverPath + '/connect';
  res.render('index', {
    title: 'Welcome IWM QuickBooks Demo',
    grantUrl: grantUrl,
    session: req.session

  });
});

/*
 * Display the access token and access secret.
 */
router.get('/display', function (req, res) {

  res.render('display', {
    Port: config.Port,
    AccessToken: req.session.AccessToken,
    AccessTokenSecret: req.session.AccessTokenSecret,
    session: req.session
  });
});

router.get('/docs/license', function (req, res, next) {
  res.render('docs/license', {
    session: req.session
  });
});

router.get('/docs/privacy', function (req, res, next) {
  res.render('docs/privacy', {
    session: req.session
  });
});

router.get('/logout', function (req, res) {
  req.session.qbo = null;
  res.render('logout', {
    session: req.session
  })
});


module.exports = router;