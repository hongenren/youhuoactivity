//获取机构详细信息
function get_org_msg() {
    var org_list = [];
    var imgs = '';
    var orgTypeName = '';
	$.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/orgPlace/queryOrgByPrjvOrgId",
            data:JSON.stringify({"prjvOrgId":prjvorgMsg.prjvOrgId}),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend:function(){
            	layer.open({type: 2,content: '加载中'});
            },
            success:function(data){
                console.log(data);
                if(data.code==0){
                layer.closeAll();
                	var data1 = data.data;
                    //判断logo是否有值
                    if(data1.logo!=''){
                        $(".warp_zy_d_sp img").attr('src',data1.logo);
                    }
                    $(".warp_zy_d_so").text(data1.createTime);
                    $("input[name='registerDate']").val(data1.createTime+' 00:00:00');
                    if(data1.mobile!=''){
                        $(".warp_zy_d_si").val(data1.mobile);
                    }
                    if(data1.weeks!=''){
                        $(".warp_zy_y_so a").text(data1.weeks);
                    }
                    if(data1.startTime!=''){
                        $("input[name='startTime']").val(data1.startTime);
                    }
                    if(data1.endTime!=''){
                        $("input[name='endTime']").val(data1.endTime);
                    }

                }else{
                    layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
                }
               
            },
            error:function(){
                layer.open({
                    content: '获取失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    });
                    return false;
            }
        })
}

    //头像上传到云 -=
    function uploadImgOne() {
        var form = document.getElementsByClassName("headimg")[0];
        
        var imgdata = new FormData(form);
        //利用ajax上传
        jQuery.ajax({
            type: "POST",
            url:img_url +'cm/upload/uploadImgFolderOSS?folderName=upaper',
            data: imgdata,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend:function(XMLHttpRequest){
                layer.open({type: 2,content: '上传中'});
            },
            success: function (data) {
                if(data.errorcode==0){
                    var src = data.data;
                    $('#img').attr('logo',src);
                    $("input[name='logo']").val(src);    
                }
                layer.closeAll();
                
            },
            error:function(){
                layer.open({
                    content: '上传失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
        })
    }
    /**上传图片 追加图片 */
    function uploadImg(i,inpt) {
        var length = $("input[name='imgs']").length;
        if(length>9){
            layer.open({content: '上传图片请勿超过9张',skin: 'msg',time: 1});
            return false;
        }
        layer.open({type: 2});
        var thi = inpt; ///获取当前
        var form = thi.parentNode
        //var form = document.getElementsByClassName("test_form")[i];
        var imgdata = new FormData(form);
        //利用ajax上传
        jQuery.ajax({
            xhrFields: {
               withCredentials: true
            },
            type: "POST",
            url: img_url + 'cm/upload/uploadImgFolderOSS?folderName=upaper',
            data: imgdata,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            // beforeSend: function(XMLHttpRequest) {
            //         $(".warp_jm").html("<div class='warp_jz'><img src='../wap/img/loading.gif' style='width:24px;height:24px; margin:0 auto;display:block;position: absolute;left: 50%;top: 50%;margin: -12px 0 0 -12px'/></div>");
            // },
            success: function (data) {
                if(data.errorcode==0){
                    var src = data.data;
                    
                    if(src){
                        var imgvar = $('#imgsrc'+i).val();
                        $('#img'+i).attr('src',src)
                        $('#imgsrc'+i).val(src)
                        if(imgvar==''){
                            add_img()
                        }
                    }
                }
                parent.layer.closeAll()
            },
            error:function(){
                $(".warp_jm").empty();
                layer.open({
                    content: '上传失败',
                    skin: 'msg',
                    time: 1 //2秒后自动关闭
                });
            }
        })
    }
    //添加图片
    function add_img()
    {
        s = $('.warp_sm_u_se div:last').attr('data-id');
        html_img = '<div class="warp_sm_u_sw" data-id="'+(parseInt(s)+1)+'">\
                        <form class="test_form" action="" method="post" enctype="multipart/form-data">\
                            <input name="orgCertCodeImg1" type="file" onchange="uploadImg('+(parseInt(s)+1)+',this)"/>\
                            <input type="hidden"  id="imgsrc'+(parseInt(s)+1)+'" name="imgs">\
                        </form>\
                        <img src="../wap/img/pws_175.jpg" id="img'+(parseInt(s)+1)+'">\
                    </div>';
        $(".warp_sm_u_se").append(html_img)
    }
    ///提交信息
    function sub_msg(){
        var SubData = {
            "prjvOrgId" : prjvorgMsg.prjvOrgId,
            "logo" : $("input[name='logo']").val(),
            "demo" : $("input[name='demo']").val(),
            "imgs" : $("input[name='imgs']").val(),
            "registerDate" : $("input[name='registerDate']").val(),
            "mobile" : $("input[name='mobile']").val(),
            "weeks" : $("input[name='weeks']").val(),
            "startTime" : $("input[name='startTime']").val(),
            "endTime" : $("input[name='endTime']").val(),
            "addressId":'',
            }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/orgPlace/perfectOrgInfo",
            data:JSON.stringify(SubData),
            dataType:'json',
            headers : {'token':token},
            contentType: "application/json;charset=utf-8",
            beforeSend:function(){
                layer.open({type: 2,content: '加载中'});
            },
            success:function(data){
                if(data.code==0){
                    layer.open({
                        content: '添加成功'
                        ,skin: 'msg'
                        ,time: 1 //1秒后自动关闭
                        });  
                    setTimeout(function(){layer.closeAll();window.history.go(-1);},1000);
                }else{
                    layer.open({
                        content: data.msg
                        ,skin: 'msg'
                        ,time: 1 //2秒后自动关闭
                    });
                }
                 
            },
             error:function(){
                layer.open({
                    content: '上传失败'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }
        })

    }

