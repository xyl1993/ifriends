var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("login");
var userDao = require('../dao/login/loginDao');

/*以下是路由配置*/

/* GET home page. */
// router.get('/',checkLogin);
router.get('/', function(req, res, next) {
	res.render('login/login.html')
});
router.get('/loginAfter', function(req, res, next) {
	var code = req.param('code');
    var state = req.param('state');
    var headers = req.headers;
    var path = "/login/oauth/access_token";
    headers.host = 'github.com';

    path += '?client_id=43310f09cfc0fb9b953f';
    path += '&client_secret=0255631d4f8266f2e30460f3f8f5ff4a4c6c299d';
    path += '&code='+ code;

    var opts = {
        hostname:'github.com',
        port:'443',
        path:path,
        headers:headers,
        method:'POST'
    };
    var req = https.request(opts, function(res){
        res.setEncoding('utf8');
        res.on('data', function(data){
            var args = data.split('&');
            var tokenInfo = args[0].split("=");
            var token = tokenInfo[1];
            console.log(token);
        })
	});
});
/*路由配置end*/

router.post('/doLogin', function(req, res, next) {
  userDao.doLogin(req, res, next)
});

router.post('/doRegister', function(req, res, next) {
  userDao.doRegister(req, res, next)
});
module.exports = router;
