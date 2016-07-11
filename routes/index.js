var express = require('express'),
    router = express.Router(),
    log = require('log4js').getLogger("index"),
    multiparty  = require('multiparty'),
    formidable = require('formidable'),
    gm = require('gm'),
    fs = require('fs'),
    imageMagick = gm.subClass({ imageMagick : true }),
    util = require('util'),
    AVATAR_UPLOAD_FOLDER = '/avatar/';

/*以下是路由配置*/

/* GET home page. */
router.get('/',checkLogin);
router.get('/',function(req, res, next) {
	res.render('index.html')
});

router.get('/home', function(req, res, next) {
	res.render('home.html')
});

router.get('/friend', function(req, res, next) {
	res.render('friend.html')
});

router.get('/photo', function(req, res, next) {
  res.render('photo.html')
});

router.get('/skills', function(req, res, next) {
  res.render('skills.html')
});

router.get('/uploadCrop', function(req, res, next) {
  res.render('upload-crop.html')
});

/*******登录注册的路由配置  start******/
router.get('/denglu', function(req, res, next) {
  res.render('login/denglu.html')
});
router.get('/register', function(req, res, next) {
  res.render('login/register.html')
});

/*******登录注册的路由配置   end******/


router.post('/index/getUserInfo',function(req,res,next) {
    res.send(req.session.user);
});
router.post('/index/logout',function(req,res,next) {
    req.session.user = null;
    var resMap = {};
    resMap.success= true;
    res.send(resMap);
});

/* 上传裁剪*/
router.post('/file/jcrop', function(req, res, next){
    var path = req.body.path;  //获取用户上传过来的文件的当前路径
    var width = req.body.width,
        height = req.body.height,
        x = req.body.x,
        y = req.body.y,
        name = req.body.name;
    gm(path)
    .crop(width, height, x, y) //加('!')强行把图片缩放成对应尺寸150*150！
    .write('/avatar/user/'+name, function(err){
      if (err) {
        console.log(err);
        res.end();
      }
      fs.unlink(path, function() {
        return res.end('3');
      });
    });
});

/* 上传*/
router.post('/file/uploading', function(req, res, next){
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
  	    uploadDir: 'public' + AVATAR_UPLOAD_FOLDER
    });
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
        	log.debug(err);
        	return
    	}else{
    		var inputFile = files.file[0];
		    var uploadedPath = inputFile.path;
		    var dstPath = 'public/files/' + inputFile.originalFilename;
		    //重命名为真实文件名
		    // fs.rename(uploadedPath, dstPath, function(err) {
		    //     if(err){
		    // 	    log.debug(err);
		    //     }
		    //   });
		    }
		var rell_path = JSON.parse(filesTmp).file[0].path.substring(6);
	    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
	    res.write('data:');
        res.end(rell_path);
	});
});

router.post('/upload', function(req, res) {

    var form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';		//设置编辑
    	form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;	 //设置上传目录
    	form.maxFieldsSize = 2 * 1024 * 1024   //文件大小
	var obj = {};
    form.parse(req, function(err, fields, files) {

    }).on('field', function(name, value) {  // 字段
    	obj[name] = value;
    }).on('file', function(name, file) {  //文件
        obj[name] = file;
    }).on('error', function(error) {  //结束
        callback(error);
    }).on('end', function() {  //结束
        callback(null,obj);
    });

});

// 检查用户登录状态
function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','用户已经登录');
		return res.redirect('/');
	}
	next();
}

function checkLogin(req,res,next){
	log.debug(req.session);
	if(!req.session.user){
		return res.redirect('/login');
	}
	next();
}

module.exports = router;
