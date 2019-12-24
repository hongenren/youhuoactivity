  /**上传图片 追加图片 */
    function uploadImg(i,inpt) {
        var length = $("input[name='imgsrc']").length;
        if(length>9){
            layer.open({content: '上传图片请勿超过9张',skin: 'msg',time: 1});
            return false;
        }
        //var form = document.getElementsByClassName("test_form")[i];
        if(!$(inpt).val()){
            return false;
        }
        layer.open({type: 2});
        var thi = inpt; ///获取当前
        var form = thi.parentNode;
        var imgdata = new FormData(form);
        //利用ajax上传
        jQuery.ajax({
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
                // layer.close();
                // $(".warp_jm").empty();
                var src = data.data;
                parent.layer.closeAll()
                if(src){
                    var imgvar = $('#imgsrc'+i).val();
                    $('#img'+i).attr('src',src)
                    $('#imgsrc'+i).val(src)
                    $('#imgsrc'+i).parent().append('<i class="mect_sc" onclick="mect_sc_click(this)" style="position: absolute;top:-10px;right:-10px;background: url(../wap/img/pws_2370.png) no-repeat center;background-size: 22px 22px;"></i>');
                    if(imgvar==''){
                        add_img()
                    }
                }
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
    function add_img(){
        s = $('.warp_sm_u_se div:last').attr('data-id');
        html_img = '<div class="warp_sm_u_sw" data-id="'+(parseInt(s)+1)+'" style="overflow: visible;">\
                        <form class="test_form" action="" method="post" enctype="multipart/form-data">\
                            <input name="orgCertCodeImg1" type="file" onchange="uploadImg('+(parseInt(s)+1)+',this)" style="display: none;"/>\
                            <input type="hidden"  id="imgsrc'+(parseInt(s)+1)+'" name="imgsrc">\
                        </form>\
                        <img src="../wap/img/pws_175.jpg" id="img'+(parseInt(s)+1)+'" onclick="openFile(this);">\
                    </div>';
        var length = $("input[name='imgsrc']").length;
        if(length==9){

        }else{
            $(".warp_sm_u_se").append(html_img);
        }
    }
    //提交任务信息
    function sub_task_msg(){
        var img = "";
        var ticket = $_GET['ticket'];
        var content = $.trim($('.warp_ms_y_so').val());
        var star = $('.star_UL').attr('sid');
        var nickName = user_msg.userNickName;
        var headImg = user_msg.userHeadImg;
        var userId = user_msg.userId;
        if(star==0){
            layer.open({content: '请进行打分',skin: 'msg',time: 1});
            return false;
        }
        //遍历图片 逗号拼接
        $("input[name='imgsrc']").each(function(index,val){
            img += $(this).val() + ",";
        })
        img = (img.substring(img.length - 1) == ',') ? img.substring(0, img.length - 1) : img;

        if(content==''&&img==''){
            layer.open({content: '内容和图片至少选择一项',skin: 'msg',time: 1});
            return false;
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type: "post",
            url: base_url + "html5/v1/activityEvaluate/volunteerEvaluate",
            data: JSON.stringify({
                "ticketCode": ticket,
                "content":content,
                "star":parseInt(star),
                "imgs":img,
                "prjvUserId":userId
            }),
            headers : {'token':token},
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                layer.open({type: 2,content: '提交中'});
            },
            success: function(data){
                parent.layer.closeAll();
                if(data.code==0){
                    layer.open({content: '提交成功',skin: 'msg',time: 1});
                    setTimeout(function(){history.back(-1)},1000);
                }else{
                    layer.open({content: data.msg,skin: 'msg',time: 1});
                }
            },
            error:function(e){
                parent.layer.closeAll();
                layer.open({
                content: '获取失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
                });
                return false;
            }
        })
    }/*
	$(".mect_sc").live("click",function(){
	  $(this).parent().parent().remove();
	});*/
  function openFile(obj){
      $(obj).parent().find("input[name='orgCertCodeImg1']").trigger("click");
  }
  function mect_sc_click(obj){
      var s = $('.warp_sm_u_se div:last').attr('data-id');
      var html_img = '<div class="warp_sm_u_sw" data-id="'+(parseInt(s)+1)+'" style="overflow: visible;">\
                        <form class="test_form" action="" method="post" enctype="multipart/form-data">\
                            <input name="orgCertCodeImg1" type="file" onchange="uploadImg('+(parseInt(s)+1)+',this)" style="display: none;"/>\
                            <input type="hidden"  id="imgsrc'+(parseInt(s)+1)+'" name="imgsrc">\
                        </form>\
                        <img src="../wap/img/pws_175.jpg" id="img'+(parseInt(s)+1)+'" onclick="openFile(this);">\
                    </div>';

      var srsNum = 0;
      $("input[name='imgsrc']").each(function(){
          if(!$(this).val()){
              srsNum ++;
          }
      });
      if(srsNum==0){
          $(".warp_sm_u_se").append(html_img);
      }
      $(obj).parent().parent().remove();
  }