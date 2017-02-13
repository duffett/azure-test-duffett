var config = require('../conf/settings.js');

var QuickBooks = require('node-quickbooks')

var express = require('express');
var router = express.Router();

var getQbo = function (req) {
    var message = 'consumerKey: ' + config.consumerKey + '<br/>'
    message += 'consumerSecret: ' + config.consumerSecret + '<br/>'
    message += 'oauth token: ' + req.query.oauth_token + '<br/>'
    message += 'oauth secret: ' + JSON.stringify(req.session) + '<br/><br/><br/>'

    message += 'AccessToken: ' + req.session.AccessToken + '<br/><br/>' + 'AccessTokenSecret: ' + req.session.AccessTokenSecret
    var realmId;

    var qbo = new QuickBooks(config.consumerKey,
        config.consumerSecret,
        req.session.AccessToken,
        req.session.AccessTokenSecret,
        '123145772159124',
        true, // don't use the sandbox (i.e. for testing)
        true); // turn debugging on
    return qbo;
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    var qbo = getQbo(req);
    qbo.findInvoices(null, function (err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }
        // console.log("INVOICE: " + JSON.stringify(data.QueryResponse.Invoice[0]))

        // console.log(data.QueryResponse.Invoice.length + ' invoices found')
        res.render('invoices', {
            invoices: data.QueryResponse.Invoice
        });

    })
});

router.get('/:id', function (req, res, next) {
    var qbo = getQbo(req);
    qbo.findInvoices({
            Id: '1031'
        },
        function (err, data) {
            if (err) {
                return res.send(JSON.stringify(err));
            }
            // console.log("INVOICE: " + JSON.stringify(data.QueryResponse.Invoice[0]))

            // console.log(data.QueryResponse.Invoice.length + ' invoices found')
            console.log("&&&&&&&&&&&&&&&&&&")
            console.log(JSON.stringify(data, null, 8))
            res.render('invoice', {
                invoice: data.QueryResponse
            });

        })
});
module.exports = router;