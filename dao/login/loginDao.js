// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $sql = require('./mapping/loginMapping');
var log = require('log4js').getLogger("loginDao");
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);
module.exports = {
	doRegister: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			
			connection.query($sql.queryCountByUserName, req.body.username,
				function(err,result) {
					var resMap = {};
					log.debug(result);
			        if(result[0].count>0){
			        	resMap.success= false;
			        	resMap.errCode = '9001';
			        	res.send(resMap);
			        }else{
			        	// 建立连接，向表中插入值
						// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
						md5.update(req.body.password);
						connection.query($sql.insert, [req.body.username, md5.digest('hex'),req.body.email,req.body.email], function(err, result) {
							resMap.success= true;
							// 释放连接 
							connection.release();
							res.send(resMap);
						});
			        }

			});
			
		});
	},
	doLogin: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryByNameAndPwd, [req.body.username, req.body.password],function(err, result) {
				var resMap = {};
				log.debug(result);
				if(result.length>0){
                    resMap.success=true;
                    resMap.data = result;
                    req.session.user = result[0];
				}else{
					resMap.success=false;
					resMap.message = "9002";
				}
				res.send(resMap);
				connection.release();
			});
		});
	}
 
};