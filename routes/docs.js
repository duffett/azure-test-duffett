var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/license', function (req, res, next) {
    res.render('docs/license');
});

router.get('/privacy', function (req, res, next) {
    res.render('docs/privacy');
});

module.exports = router;