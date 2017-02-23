var express = require('express');
var router = express.Router();
var config = require('../../conf/settings.js');
var token = require('../../conf/token.js');
var
    request = require('request'),
    qs = require('querystring')
/* GET the access token. */
router.get('/', function (req, res) {
    console.log('GET callback');
    var sessionData = req.session;
    sessionData.AccessToken = '';
    sessionData.AccessTokenSecret = '';
    sessionData.Port = config.Port;
    var getAccessToken = {
        url: config.ACCESS_TOKEN_URL,
        oauth: {
            consumer_key: token.consumer.key,
            consumer_secret: token.consumer.secret,
            token: req.query.oauth_token,
            token_secret: req.session.oauth_token_secret,
            verifier: req.query.oauth_verifier,
            realmId: req.query.realmId
        }
    }
    request.post(getAccessToken, function (e, r, data) {
        console.log('RESPONSE from getAccessToken.url: ' + getAccessToken.url)
        if (e) {
            console.log("ERROR: " + JSON.stringify(e));
        }
        var accessTokenLocal = qs.parse(data);

        req.session.qbo = {
            token: accessTokenLocal.oauth_token,
            secret: accessTokenLocal.oauth_token_secret,
            companyid: getAccessToken.oauth.realmId
        };

        console.log(accessTokenLocal);
        if (sessionData.AccessToken != null) {
            console.log('*******')
            console.log(JSON.stringify(r, null, 5));
            console.log('*******')
            console.log(JSON.stringify(data, null, 5));
            console.log('*******')
            res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location = "/display";window.close();</script></body></html>')
        }
    })
});
module.exports = router;