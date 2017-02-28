var config = require('../conf/settings.js');
var token = require('../conf/token.js');

var QuickBooks = require('node-quickbooks')

var express = require('express');
var router = express.Router();

var getQbo = function () {
    // var qbInfo = {
    //     consumer: {
    //         key: config.consumerKey,
    //         secret: config.consumerSecret
    //     },
    //     oauth: {
    //         token: args.token,
    //         secret: args.secret
    //     },
    //     companyId: args.companyid
    // };
    // var message = 'consumerKey: ' + qbInfo.consumer.key + '<br/>'
    // message += 'consumerSecret: ' + config.consumerSecret + '<br/>'
    // message += 'oauth token: ' + args.token + '<br/>'
    // message += 'oauth secret: ' + args.secret + '<br/><br/><br/>'
    console.log('ARGS: \n' +
        token.consumer.key + '\n' +
        token.consumer.secret + '\n' +
        token.oauth.token + '\n' +
        token.oauth.secret + '\n' +
        token.companyId);

    var qbo = new QuickBooks(
        token.consumer.key,
        token.consumer.secret,
        token.oauth.token,
        token.oauth.secret,
        token.companyId,
        false, // don't use the sandbox (i.e. for testing)
        false); // turn debugging on
    return qbo;
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log("/invoice/")
    var qbo = getQbo();
    qbo.findInvoices(null, function (err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }
        // console.log("data?")
        res.render('invoices', {
            invoices: data.QueryResponse.Invoice,
            session: req.session
        });

    })
});

router.get('/:id/', function (req, res, next) {

    console.log("ID: " + req.params.id + req.query.shipping)
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

router.get('/:id/shipping', function (req, res, next) {

    console.log("ID: " + req.params.id)
    var qbo = getQbo(req.session.qbo);
    qbo.getInvoice(req.params.id, function (err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }

        res.render('shipping', {
            layout: 'doc',
            invoice: data,
            session: req.session
        });
    });
});
module.exports = router;