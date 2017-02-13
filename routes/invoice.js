var config = require('../conf/settings.js');

var QuickBooks = require('node-quickbooks')

var express = require('express');
var router = express.Router();

var getQbo = function (args) {
    var message = 'consumerKey: ' + config.consumerKey + '<br/>'
    message += 'consumerSecret: ' + config.consumerSecret + '<br/>'
    message += 'oauth token: ' + args.token + '<br/>'
    message += 'oauth secret: ' + args.secret + '<br/><br/><br/>'

    var realmId;

    var qbo = new QuickBooks(config.consumerKey,
        config.consumerSecret,
        args.token,
        args.secret,
        args.companyid,
        false, // don't use the sandbox (i.e. for testing)
        true); // turn debugging on
    return qbo;
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    var qbo = getQbo(req.session.qbo);
    qbo.findInvoices(null, function (err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.render('invoices', {
            invoices: data.QueryResponse.Invoice,
            session: req.session


        });

    })
});

router.get('/:id', function (req, res, next) {

    console.log("ID: " + req.params.id)
    var qbo = getQbo(req.session.qbo);
    qbo.getInvoice(req.params.id, function (err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.render('invoice', {
            invoice: data,
            session: req.session
        });

    })
});
module.exports = router;