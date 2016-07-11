//模块化
var mainModule = angular.module('mainModule', ['ui.router',
				'ngResource', 'ngSanitize']);

//全局配置
mainModule.run(function($rootScope, $state, $http, $stateParams, $location,$timeout,$window) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	// 路由调整完成后根据state添加标志
	$rootScope.$on('$stateChangeSuccess', 
		function(event, toState, toParams, fromState){
          var toStateUrl = toState.url;
          
		});
	});

///路由配置
mainModule.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
	$stateProvider.state('home',{
		url : '/home',               //home
		templateUrl : '/home'
	}).state('friend',{
		url : '/friend',               //关于我
		templateUrl : '/friend'
	}).state('photo',{
		url : '/photo',               //经验
		templateUrl : '/photo'
	}).state('uploadCrop',{
		url : '/uploadCrop',               //技能
		templateUrl : '/uploadCrop'
	});
	$urlRouterProvider.otherwise('/home');   //默认home
}]);

//主目录控制器
mainModule.controller('mainCtrl', ['$scope','myService', function($scope,myService){
	 //获取用户信息
  var _url = 'index/getUserInfo';
  myService.setUrl(_url);  //方法设置路径
  myService.setData();
  //call请求回调
  myService.requestData().then(function(res){
    $scope.userData = res;
  })
}])

//添加好友控制器
mainModule.controller('addFrindCtrl', ['$scope','myService', function($scope,myService){
   //获取用户信息
  var _url;
  $scope.friendData = {};
  $scope.add=function(id){
    _url = 'friend/addFriend';
    myService.setUrl(_url);  //方法设置路径
    myService.setData({'friendId':id});
    myService.requestData().then(function(res){
      if(res.success){
        alert('添加成功');
        $scope.isFriend =false;
      }else{
        alert("系统内部错误");
      }
    });
  }
  $scope.search = function(){
    $scope.friendDatas = [];
    $scope.flag = false;

    _url = 'friend/searchFriend';
    myService.setUrl(_url);  //方法设置路径
    myService.setData({'username':$scope.search.username});
    myService.requestData().then(function(res){
      if(res.success){
        $scope.isFriend = res.ifFriend;
        if(res.data){
          $scope.friendDatas.push(res.data);
        }else{
          $scope.flag = true;
        }
      }else{
        alert("系统内部错误");
      }
    });
  }
}])


//主目录切换的指令
mainModule.directive('tabChange', function(){
	// Runs during compile
	return {
		link: function($scope, iElm, iAttrs) {
			if(sessionStorage.selLastId){
				$("#" + sessionStorage.selLastId + "").addClass('active');
			}else{
				$("#home").addClass('active');
			}
			$(iElm).click(function() {
				sessionStorage.selLastId = iElm[0].id;
				$(iElm).addClass('active').siblings()
						.removeClass('active');
			});
		}
	};
});


//退出登录指令
mainModule.directive('logout', ['$http',function($http){
  // Runs during compile
  return {
    link: function($scope, iElm, iAttrs) {
      iElm.bind('click', function(event) {
        /* Act on the event */
        $http({
          url:'index/logout',
          method:'POST'
        }).success(function(res){
          if(res.success){
            CookieUtil.unset("username");
            CookieUtil.unset("password");
            location.href="/login";
          }
        })
      });
    }
  };
}]);

/**
  *普通ajax请求公共服务
  */
 mainModule.factory('myService',['$http','$q',function($http,$q){
    var service = {},
        baseUrl /*:String*/= '../',
        _url /*:String*/= '',
        _finalUrl /*:String*/= '',
        _token /*:String*/= '',
        _deviceSystem /*:Boolean*/=0,
        _data  /*:Object*/= {};
    
    /**
     * 处理请求路径
     */
    var makeUrl = function(){
      _url = _url.split(' ').join('+');
      _finalUrl = baseUrl +_url;
      return _finalUrl
    }
    
    /**
     * 设置请求路径
     */
    service.setUrl = function(url){
      _url = url;
    }
    
    service.setToken = function(token){
      _token = token;
    }
    
    service.setData = function(data){
      _data = data;
    }
    
    service.setDeviceSystem = function(deviceSystem){
      _deviceSystem = deviceSystem;
    }
    /**
     * 获取请求路径
     */
    service.getUrl = function(){
      return _url;
    }
    
    service.getToken = function(){
      return _token;
    }
    
    service.getData = function(){
      return _data;
    }
    
    /**
     *  $q.defer() 构建的 deffered 实例的几个方法的作用。
     *  如果异步操作成功，则用resolve方法将Promise对象的状态变为“成功”（即从pending变为resolved）；如果异步操作失败，
     *  则用reject方法将状态变为“失败”（即从pending变为rejected）。最后返回 deferred.promise ，我们就可以链式调用then方法。
     */
    service.callItuns = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      /**
       * deffered 对象的方法
       * 1.resolve(value)：在声明resolve()处，表明promise对象由pending状态转变为resolve。 成功状态
       * 2.reject(reason)：在声明resolve()处，表明promise对象由pending状态转变为rejected。失败状态
       * 3.notify(value) ：在声明notify()处，表明promise对象unfulfilled状态，在resolve或reject之前可以被多次调用。
       */
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl
	  }).success(function(resp){
	       defrred.resolve(resp);
	  }) 
	  /**
	   * 返回promise对象
	   * 1.then(errorHandler, fulfilledHandler, progressHandler)：
	   * then方法用来监听一个Promise的不同状态。errorHandler监听failed状态，
	   * fulfilledHandler监听fulfilled状态，progressHandler监听unfulfilled（未完成）状态。
	   * 此外,notify 回调可能被调用 0到多次，提供一个进度指示在解决或拒绝（resolve和rejected）之前。
	   * 2.catch(errorCallback) —— promise.then(null, errorCallback) 的快捷方式
	   * 3.finally(callback) ——让你可以观察到一个 promise 是被执行还是被拒绝, 但这样做不用修改最后的 value值。
	   *  这可以用来做一些释放资源或者清理无用对象的工作,不管promise 被拒绝还是解决。 更多的信息请参阅 完整文档规范.
	   */
	  return defrred.promise;
    }
    /**
     * 请求中带data参数
     */
    service.requestData = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,data:_data
	  }).success(function(resp){
	       defrred.resolve(resp);
	  }) 
	  return defrred.promise;
    }
    /**
     * 请求带token
     */
    service.requestToken = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,headers : {'token' : _token}
	  }).success(function(resp){
	       defrred.resolve(resp);
	  }) 
	  return defrred.promise;
    }
    /**
     * 请求带token and data
     */
    service.requestTokenAndData = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,data:_data,headers : {'token' : _token}
	  }).success(function(resp){
	       defrred.resolve(resp);
	  }) 
	  return defrred.promise;
    }
    /**
     * 请求带token and data and deviceSystem
     */
    service.requestTokenAndDataDev = function(){
      makeUrl();
      //通过 调用 $q.defferd 返回deffered对象以链式调用
      var defrred = $q.defer();
      $http({
	     method: 'post', url: _finalUrl,data:_data,headers : {'token' : _token,'deviceSystem' : _deviceSystem}
	  }).success(function(resp){
//	     if(resp.code == 0){
	       defrred.resolve(resp);
//	     }
	  }) 
	  return defrred.promise;
    }
    return service;
 }]);
