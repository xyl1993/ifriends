var express = require('express'),
    router = express.Router(),
    log = require('log4js').getLogger("home"),
    homeDao = require('../dao/home/homeDao');


router.post('/subDynamic', function(req, res, next) {
  homeDao.subDynamic(req, res, next)
});
module.exports = router;