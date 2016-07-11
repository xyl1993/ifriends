var home = {
	insertDynamic:'INSERT INTO t_dynamic(content, user,create_time) VALUES(?,?,?)',
	insertImg:'INSERT INTO t_images(url, dynamic,user) VALUES(?,?,?)'
};
 
module.exports = home;