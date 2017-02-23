var express = require('express');
var router = express.Router();
var config = require('../../conf/settings.js');
var token = require('../../conf/token.js');
var
    request = require('request'),
    qs = require('querystring')

/* Get the request token. */
router.get('/', function (req, res) {
    var sessionData = req.session;
    sessionData.oauth_token_secret = '';
    var serverPath = 'http://' + req.get('host');
    console.log("POTENTIAL CALLBACK: " + serverPath)
    var getrequestToken = {
        url: config.REQUEST_TOKEN_URL,
        oauth: {
            callback: serverPath + '/callback/',
            consumer_key: token.consumer.key,
            consumer_secret: token.consumer.secret
        }
    }
    request.post(getrequestToken, function (e, r, data) {
        var requestToken = qs.parse(data)
        sessionData.oauth_token_secret = requestToken.oauth_token_secret
        console.log("SAVE INTO token.js???\n\n" + JSON.stringify(requestToken));
        res.redirect(config.AuthorizeUrl + requestToken.oauth_token)
    })
});
module.exports = router;