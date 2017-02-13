var express = require('express');
var router = express.Router();
var config = require('../conf/settings.js')
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("GRANT URL PORT: " + config.Port)
  var grantUrl = 'http://localhost:' + config.Port + '/connect';
  res.render('index', {
    title: 'Welcome IWM QuickBooks Demo',
    grantUrl: grantUrl
  });
});

/*
 * Display the access token and access secret.
 */
router.get('/display', function (req, res) {

  res.render('display', {
    Port: config.Port,
    AccessToken: req.session.AccessToken,
    AccessTokenSecret: req.session.AccessTokenSecret
  });
});

module.exports = router;