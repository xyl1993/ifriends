// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $sql = require('./mapping/photoMapping');
var log = require('log4js').getLogger("photoDao");;
// 使用连接池，提升性能
var pool  = mysql.createPool($conf.mysql);
module.exports = {
	getIPhoto: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			
			connection.query($sql.selDynHaveImg, [req.session.user.id],
				function(err,result) {
					resMap = {};
					if(!err){
						resMap.success=true;
                    	resMap.data = result;
					}
					res.send(resMap);
					connection.release();
			});
		});
	}
 
};