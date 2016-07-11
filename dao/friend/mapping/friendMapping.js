var friend = {
	searchFriend:'select * from t_user where username =?',
	addFriend:'insert into t_friends(user_id,friend_id) values(?,?)',
	isFriend:'select count(*) as count from t_friends where user_id=? and friend_id= ?'
};
 
module.exports = friend;