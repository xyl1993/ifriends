var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("photo");
var photoDao = require('../dao/photo/photoDao');


router.post('/getIPhoto', function(req, res, next) {
  photoDao.getIPhoto(req, res, next)
});

module.exports = router;
