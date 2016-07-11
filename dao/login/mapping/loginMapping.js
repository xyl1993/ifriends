var login = {
	insert:'INSERT INTO t_user(username, password,email,nike) VALUES(?,?,?,?)',
	queryByNameAndPwd:'select * from t_user where username=? and password=?',
	queryCountByUserName:'select count(*) as count from t_user where username=?'
};
 
module.exports = login;