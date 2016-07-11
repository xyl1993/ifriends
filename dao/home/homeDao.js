// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $sql = require('./mapping/homeMapping');
var log = require('log4js').getLogger("homeDao");;
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);
module.exports = {
	subDynamic: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			
			connection.query($sql.insertDynamic, [req.body.content,req.session.user.id,req.body.create_time],
				function(err,result) {
					resMap = {};
					if(!err){
						var imgArr = req.body.imgUrl;
						for(var i=0,len=imgArr.length;i<len;i++){
							connection.query($sql.insertImg, [imgArr[i],result.insertId,req.session.user.id],
								function(err,result) {
									log.debug(err);
									resMap.success= true;
									res.send(resMap);
									// 释放连接 
							});
						}
					}
					connection.release();
			});
		});
	}
 
};