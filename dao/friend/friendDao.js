// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $sql = require('./mapping/friendMapping');
var log = require('log4js').getLogger("friendDao");;
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);
module.exports = {
	searchFriend: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			
			connection.query($sql.searchFriend, [req.body.username],
				function(err,result) {
					resMap = {};
					if(!err){
						resMap.data = result[0];
						connection.query($sql.isFriend, [req.session.user.id,result[0].id],
							function(err,result) {
								if(!err){
									resMap.success = true;
									resMap.ifFriend = result.count == 0?false:true;
									res.send(resMap);
								}
						});
					}
					connection.release();
			});
		});
	},
	addFriend: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			
			connection.query($sql.addFriend, [req.session.user.id,req.body.friendId],
				function(err,result) {
					resMap = {};
					log.debug(err);
					if(!err){
						resMap.success = true;
					}
					res.send(resMap);
					connection.release();
			});
		});
	}
 
};