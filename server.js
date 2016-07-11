//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app     = express();
var ejs = require('ejs');
var path    = require('path');
var log4js = require('log4js');
var session = require('express-session');

var cookieParser = require('cookie-parser');

var redisStore = require('connect-redis')(session);

var bodyParser = require('body-parser');
var multer = require('multer');

//文件上传
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
//中间件body-parser和multer用于处理和解析post请求的数据。
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//以下为路由配置
var routes = require('./routes/index');
var login = require('./routes/login');
var home = require('./routes/home');
var photo = require('./routes/photo');
var friend = require('./routes/friend');

app.engine('html', require('ejs').renderFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var mysql = require('mysql');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'ghost')));
app.use(express.static(path.join(__dirname, 'login')));

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 24*3600*1000 }}))

app.use('/', routes);
app.use('/login', login);
app.use('/home', home);
app.use('/photo', photo);
app.use('/friend', friend);

log4js.configure('my_log4js_configuration.json',{});
var logger = log4js.getLogger('nomel');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel = "";
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
  var mongoHost = process.env[mongoServiceName + "_SERVICE_HOST"];
  var mongoPort = process.env[mongoServiceName + "_SERVICE_PORT"];
  var mongoUser = process.env.MONGODB_USER
  if (mongoHost && mongoPort && process.env.MONGODB_DATABASE) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
      mongoURL += process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@';
    }
    // Provide UI label that excludes user id and pw

    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + process.env.MONGODB_DATABASE;
    mongoURL += mongoHost + ':' + mongoPort + '/' + process.env.MONGODB_DATABASE;
  }
}
var db = null;
var dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');  
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log("Connected to MongoDB at: " + mongoURL);
  });
};




exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
};

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);

module.exports = app;
