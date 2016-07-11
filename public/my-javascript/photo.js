/*homeCtrl*/
mainModule.controller('photoCtrl', ['$scope','myService', function($scope,myService){

	$scope.imgDatas=[];//相册数据对象
	$scope.photoSee = function(imgData){
		$scope.seeImg = imgData.url;
		$scope.imgText = imgData.content;
		var innerHeight = getInnerHeight(),
            imgHeight = $('#photo-modal .modal-dialog').height();
        var atop = (innerHeight-imgHeight)/2
		$('#photo-modal .modal-dialog').css({'top':atop});
		$('#photo-modal').modal({
		  keyboard: false
		})
	}
	//设置请求路径
	var _url = 'photo/getIPhoto',
	    data = {};
   	myService.setUrl(_url);  //方法设置路径
	myService.setData(data);
	//call请求回调
	myService.requestData().then(function(res){
 	    if(res.success){
 	    	for(var i=0,len=res.data.length;i<len;i++){
 	    		$scope.imgDatas.push(res.data[i]);
 	    	}
 	    	console.log(res.data);
 	    }else{
 	    	alert("系统内部错误");
 	    }
	});
}]);

/**获取浏览器高度***/
function getInnerHeight() {
	var winHeight
	// 获取窗口高度
	if (window.innerHeight){
		winHeight = window.innerHeight;
	}else if ((document.body) && (document.body.clientHeight)){
		winHeight = document.body.clientHeight;
	}
	return winHeight
}
