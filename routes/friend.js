var express = require('express'),
    router = express.Router(),
    log = require('log4js').getLogger("friend"),
    friendDao = require('../dao/friend/friendDao');


router.post('/searchFriend', function(req, res, next) {
  friendDao.searchFriend(req, res, next)
});
router.post('/addFriend', function(req, res, next) {
  friendDao.addFriend(req, res, next)
});
module.exports = router;