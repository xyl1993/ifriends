/*homeCtrl*/
mainModule.controller('cropCtrl', ['$scope','myService', function($scope,myService){

    $scope.uploadfile = function(){
        //设置请求路径
        var temp = $('#imgUrl').val(),
            name = temp.split('/avatar/')[1];
        var _url = 'file/jcrop',
            myDate = new Date(),
            data = {
                path:temp.replace(/\\/g,"/"),
                width:$('#w').val(),
                height: $('#h').val(),
                x: $('#x1').val(),
                y: $('#y1').val(),
                name : name
            }
        myService.setUrl(_url);  //方法设置路径
        myService.setData(data);
        //call请求回调
        myService.requestData().then(function(res){
            if(res.success){
                alert('保存成功');
            }else{
                alert(errCode[res.errCode]);
            }
        });
    }

}]);
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

// check for selected crop region
function checkform() {
    if (parseInt($('#w').val())) {
    }else{
        $('.error').html('Please select a crop region and then press Upload').show();
    }
    $.ajax({
        url:''
    })
};

// update info by cropping (onChange and onSelect events handler)
function updateInfo(e) {
    $('#x1').val(e.x);
    $('#y1').val(e.y);
    $('#x2').val(e.x2);
    $('#y2').val(e.y2);
    $('#w').val(e.w);
    $('#h').val(e.h);
};

// clear info by cropping (onRelease event handler)
function clearInfo() {
    $('.info #w').val('');
    $('.info #h').val('');
};

function fileSelectHandler() {

    // get selected file
    var oFile = $('#image_file')[0].files[0];

    // hide all errors
    $('.error').hide();

    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (! rFilter.test(oFile.type)) {
        $('.error').html('Please select a valid image file (jpg and png are allowed)').show();
        return;
    }

    // check for file size
    if (oFile.size > 250 * 1024) {
        $('.error').html('You have selected too big file, please select a one smaller image file').show();
        return;
    }

    // preview element
    var oImage = document.getElementById('preview');

    // prepare HTML5 FileReader
    var oReader = new FileReader();
        oReader.onload = function(e) {

        // e.target.result contains the DataURL which we can use as a source of the image
        oImage.src = e.target.result;
        oImage.onload = function () { // onload event handler

            // display step 2
            $('.step2').fadeIn(500);

            // display some basic image info
            var sResultFileSize = bytesToSize(oFile.size);
            $('#filesize').val(sResultFileSize);
            $('#filetype').val(oFile.type);
            $('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);

            // Create variables (in this scope) to hold the Jcrop API and image size
            var jcrop_api, boundx, boundy;

            // destroy Jcrop if it is existed
            if (typeof jcrop_api != 'undefined') 
                jcrop_api.destroy();

            // initialize Jcrop
            $('#preview').Jcrop({
                minSize: [32, 32], // min crop size
                aspectRatio : 1, // keep aspect ratio 1:1
                bgFade: true, // use fade effect
                bgOpacity: .3, // fade opacity
                onChange: updateInfo,
                onSelect: updateInfo,
                onRelease: clearInfo
            }, function(){

                // use the Jcrop API to get the real image size
                var bounds = this.getBounds();
                boundx = bounds[0];
                boundy = bounds[1];

                // Store the Jcrop API in the jcrop_api variable
                jcrop_api = this;
            });
        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
    var xhr;
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
                    $('#imgUrl').val(resUrl);
                } else {
                    alert('服务器出错');
                }
            }
        };
        xhr.open("POST", "/file/uploading", true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        var fd = new FormData();
        fd.append("file", oFile);
        xhr.send(fd);
    }
}