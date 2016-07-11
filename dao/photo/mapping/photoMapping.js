var photo = {
	selectById:'select * from t_images where user=?',
	selDynHaveImg:'SELECT a.content,a.create_time,b.url from t_dynamic a LEFT JOIN t_images b on  a.id = b.dynamic where a.user = ?'
};
 
module.exports = photo;