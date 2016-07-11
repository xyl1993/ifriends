/*homeCtrl*/
mainModule.controller('homeCtrl', ['$scope','myService', function($scope,myService){

	var regR = /\(.*?\)/g;
	var imgArr = [],_backgroundImg;
    
	$('#imgFile').bind('change', function(event) {
		/* Act on the event */
		uploadfile(event);
	});
    
    $scope.showImg = function(){
    	if($("#imgTip").is(':hidden')){
        	$("#imgTip").css({
        		display: 'block'
        	});
    	}else{
			$("#imgTip").css({
				display: 'none'
			});
    	}
    }

    $scope.share = function(){
    	for (var i = 0,len=$('.myPic').length;i<len;i++) {
            _backgroundImg = $($('.myPic')[i]).find('div').css('backgroundImage');
            var temp = _backgroundImg.match(regR)[0].slice(2, -2);
    		imgArr.push(temp);
    	}
    	if($('#dynContent').val() == '' && imgArr.length==0 ){
    		alert('随便说点什么吧');
    	}else{
    		//设置请求路径
			var _url = 'home/subDynamic',
				myDate = new Date(),
			    data = {
			    	content:$('#dynContent').val(),
			    	imgUrl:imgArr,
			    	create_time:getTime()
			    }
		   	myService.setUrl(_url);  //方法设置路径
			myService.setData(data);
			//call请求回调
			myService.requestData().then(function(res){
		 	    if(res.success){
                    $('#dynContent').val('');
                    $("#imgTip").css({
                        display: 'none'
                    });
                    $('.pic').remove();
		 	    	alert('保存成功');
		 	    }else{
		 	    	alert(errCode[res.errCode]);
		 	    }
			});
    	}
    }
	function uploadfile(eventP) {
        var files = eventP.target.files,
            len = files.length,
            _files = document.getElementById("imgFile"),
            type,
            resUrl,_html,
            fd,   /*FormData*/
            xhr;

        if (len == 0) {
            alert("请选择文件");
            return;
        }
        if(checkImgType(_files)){
        	type = files[0].value;
	        xhr = false;
	        try {
	            xhr = new XMLHttpRequest();//尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
	        } catch (e) {
	            xhr = ActiveXobject("Msxml12.XMLHTTP");//使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
	        }
	        if (xhr.upload) {
	            // 文件上传成功或是失败
	            xhr.onreadystatechange = function (e) {
	                if (xhr.readyState == 4) {
	                    if (xhr.status == 200) {
	                    	resUrl = xhr.responseText.split(":")[1].replace(/\\/g,"/");

	                        _html = '<li class="pic myPic"><a class="chat-close" onclick="removeimg(this)">-</a>'+
                            		'<div style="background-image: url('+resUrl+')"></div>'+
                                	'</li>'
	                        $('.add').before(_html);
	                    } else {
	                        alert('服务器出错');
	                    }
	                }
	            };
	            xhr.open("POST", "/file/uploading", true);
	            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	            var fd = new FormData();
	            fd.append("file", files[0]);
	            xhr.send(fd);
	        }
        }
        $("#imgFile").unbind().change(function (e) {
            uploadfile(e);
        });
    }

    
}]);
//点击移除图片
function removeimg(e){
	e.parentNode.remove();
}
/*  
 * 判断图片类型  
 */    
function checkImgType(ths){    
    if (ths.value == "") {    
        alert("请上传图片");    
        return false;    
    } else {    
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(ths.value)) {    
            alert("图片类型必须是.gif,jpeg,jpg,png中的一种");    
            ths.value = "";    
            return false;    
        }    
    }    
    return true;    
}
//获取单前日期 年月日时分秒
function getTime(){
   var currDate = new Date();
   var d = new Date();
   var YMDHMS = d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
   return YMDHMS;
}
