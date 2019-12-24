var sectionCode = $_GET['sectionCode'];
//获取用户评价列表
/*function get_user_evaluate(sectionCode,type){
    var data = {"pageNumber":1,"pageSize":10,"prjvUserId":user_msg.userId,"type":type}
    $.ajax({
        xhrFields: {
           withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/activityEvaluate/selectByPrjvUserIdAndType",
        data:JSON.stringify(data),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            console.log(data);
            if(data.code==0){
                var data1 = data.data.records;
                $.each(data1,function(index,val){
                    html += ' <li class="warp_gl_w_su">\
                                <div class="warp_gl_w_sy">';
                    if(val.headImg==''){
                        html += '<img src="../wap/img/pws_244.png" class="warp_gl_w_sy_ig">';
                    }else{
                        html += '<img src="'+val.headImg+'" class="warp_gl_w_sy_ig">';
                    }
                    html +=     '<div class="warp_gl_w_st">\
                                        <div class="warp_gl_w_sr">\
                                            <i>'+val.createTime+'</i>';
                    if(val.nickName==''){
                        html += '<span></span>';
                    }
                    html += '<span>'+val.nickName+'</span>';
                    html  +=         '</div>\
                                        <div class="warp_gl_w_se">';
                    for (var i = 0; i < val.star; i++) {
                        html  += '<img src="../wap/img/pws_267.png">';
                    };
                    for (var i = 0; i < (5-val.star); i++) {
                        html  += '<img src="../wap/img/pws_266.png">';
                    };
                    html  +=    '</div>\
                                    </div>\
                                </div>\
                                <div class="warp_gl_w_sw">';
                    if(val.content==''){
                        html += '<span></span>';
                    }else{
                        html += '<span>'+val.content+'</span>'
                    }
                    html += '</div>\
                                <div class="exc2">\
                                    <div class="list">\
                                        <ul>';
                    if(val.imgs!=''){
                        var imgs = val.imgs.split(',');
                        for (var i = 0; i < imgs.length; i++) {
                            if(imgs[i]!=''){
                                html += '<li><a href="javascript:void(0)"><img src="'+imgs[i]+'"></a></li>';
                            }
                        };
                    }
                    html +='</ul>\
                                </div>\
                            </div>\
                            <div class="warp_gl_w_sq">\
                                <span>来自【'+val.activityName+'】评价</span>\
                            </div>\
                            <ul class="warp_gl_w_sl">\
                                <li class="warp_gl_w_sl_1">\
                                    <a href="javascript:void(0)"><img src="../wap/img/pws_271.png">回复</a>\
                                </li>\
                                <li class="warp_gl_w_sl_2">\
                                    <a href="javascript:void(0)" data-id="'+val.id+'"><img src="../wap/img/pws_272.png">删除</a>\
                                </li>\
                            </ul>\
                        </li>';
                })
                $(".warp_gl_w_si").empty(html);
                $(".warp_gl_w_si").append(html);
            }
        },
        error:function(e){
            layer.open({
                content: '查询失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}*/

//获取管理员已评价列表 或用户评价
function get_activityEvaluate(sectionCode,type,page,size,status=1){
    var html = '';
    var data = {"pageNumber":page,"pageSize":size,"sectionCode":sectionCode,"type":type}
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/activityEvaluate/selectBySectionCode",
        data:JSON.stringify(data),
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        beforeSend:function(XMLHttpRequest){
            // $(".warp_gl_w_si").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
        },
        success:function(data){
            console.log(data);
            if(data.code==0){
                var data1 = data.data.records;
                console.log(data1)
                if(status==1){
                    $(".warp_gl_w_si").empty();
                }
                if(data1.length>0){
                    $.each(data1,function(index,val){
                        html += ' <li class="warp_gl_w_su">\
                                    <div class="warp_gl_w_sy">';
                        if(val.headImg==''){
                            html += '<img src="../wap/img/pws_244.png" class="warp_gl_w_sy_ig">';
                        }else{
                            html += '<img src="'+val.headImg+'" class="warp_gl_w_sy_ig">';
                        }
                        html +=     '<div class="warp_gl_w_st">\
                                            <div class="warp_gl_w_sr">\
                                                <i>'+get_date(val.createTime, 0)+'</i>';
                        html += '<span>'+val.nickName+'</span>';
                        if(type==20 && val.prjvUserName!=""){
                            html += '<br /><span>对'+val.prjvUserName+'的评价</span>';
                        }
                        html += '</div>\
                                <div class="warp_gl_w_se">';
                        for (var i = 0; i < val.star; i++) {
                            html  += '<img src="../wap/img/pws_267.png">';
                        };
                        for (var i = 0; i < (5-val.star); i++) {
                            html  += '<img src="../wap/img/pws_266.png">';
                        };
                        html  +=    '</div>\
                                        </div>\
                                    </div>\
                                    <div class="warp_gl_w_sw">';
                        if(val.content==''){
                            html += '<span></span>';
                        }else{
                            html += '<span>'+val.content+'</span>'
                        }
                        html += '</div>\
                                    <div class="exc2">\
                                        <div class="list">\
                                            <ul>';
                        if(val.imgs!=''){
                            var imgs = val.imgs.split(',');
                            imgs.pop();
                            $.each(imgs,function(index,val){
                                if(imgs[i]!=''){
                                    html += '<li><a href="javascript:void(0)"><img name="taskImgs" src="'+val+'"></a></li>';
                                }
                            });
                        }
                        var te = "回复";
                        if(type==20){
                            te = "修改评价"
                        }
                        console.log(te)
                        html +=     '</ul>\
                                        </div>\
                                    </div>\
                                    <div class="warp_gl_w_sq">\
                                        <span>来自【'+val.activityName+'】评价</span>\
                                    </div>\
                                    <ul class="warp_gl_w_sl">\
                                        <li class="warp_gl_w_sl_1" var-type="'+type+'" val-star="'+val.star+'" val-imgs="'+val.imgs+'" val-id="'+val.id+'" val-ticketCode="'+val.ticketCode+'" val-content="'+val.content+'">\
                                            <a href="javascript:void(0)"><img src="../wap/img/pws_271.png">'+te+'</a>\
                                        </li>\
                                        <li class="warp_gl_w_sl_2">\
                                            <a href="javascript:void(0)" data-id="'+val.id+'"><img src="../wap/img/pws_272.png">删除</a>\
                                        </li>';

                        var replyList = val.replyList;
                        for (var i = 0; i < replyList.length; i++) {
                            if(replyList[i].headImg==null || replyList[i].headImg==undefined || replyList[i].headImg==""){
                                replyList[i].headImg = "<img src=\"../wap/img/pws_244.png\">";
                            }else{
                                replyList[i].headImg = "<img src=\""+replyList[i].headImg+"\">";
                            }
                            html +=   '<div class="warp_gl_w_sk">\
                                                                '+replyList[i].headImg+'\
                                                                <div class="warp_gl_w_sj">\
                                                                    <div class="warp_gl_w_sh">\
                                                                        <i>'+replyList[i].createTime+'</i>\
                                                                        <span>'+replyList[i].prjvUserName+'</span>\
                                                                    </div>\
                                                                    <div class="warp_gl_w_sg">\
                                                                        <span>'+replyList[i].content+'</span>\
                                                                    </div>\
                                                                </div>\
                                                            </div>';
                        }
                        html +=   '</ul></li>';
                    })
                    $(".loadings").remove();
                    $(".warp_gl_w_si").append(html);

                    $("img[name='taskImgs']").each(function(i){
                        $(this).height($(this).width());
                        $(this).attr("src", $(this).attr("src")+"?x-oss-process=image/resize,m_pad,h_"+$(this).width()+",w_"+$(this).width()+",color_FFFFFF");
                    })
                }else{
                    if($(".lastNothing").length>0){
                        $(".lastNothing").remove();
                    }
                    $(".loadings").remove();
                    if($(".loadings").length<=0){
                        $(".warp_gl_w_si").append('<div class="lastNothing" style="font-size:14px;line-height:50px;text-align:center;color:#666;">没有了</div>');
                    }
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
        error:function(e){
            layer.open({
                content: '查询失败'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}
//删除评论
// function del_evaluate(){
//     var data = {"id":};

// }
var evaluateScrollEvent=function(type,init,id=null){
    var page = 0;//从1
    var size = 10;
    var t=0;
    var p=0;
    console.log(type)
    if(init==1){
        page++;
        get_activityEvaluate(sectionCode,type,page,size,1);

    }else if(init==2){
        page++;
        get_needEvaluate(sectionCode, "全部岗位", id,page,size,1);
    }
    $(document).unbind('scroll').scroll(function(e){
        t=$(this).scrollTop();
        var doc=$(document).height();
        var win=$(window).height();
        if(p<=t){//console.log("向下");
            if(t>doc-(win+60)){
                if($(document).height() - $(window).height() == $(window).scrollTop()){
                    if(init==1){
                        $(".warp_gl_w_si").append("<img class='loadings' src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                    }else if(init==2){
                        $(".warp_gl_w_sv").append("<img class='loadings' src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
                    }

                    page++;
                    if(type==10){
                        get_activityEvaluate(sectionCode,10,page,size,2);
                    }else if(type==20){
                        get_activityEvaluate(sectionCode,20,page,size,2);
                    }else if(type==30){
                        get_needEvaluate(sectionCode, "全部岗位", id,page,size,2);
                    }
                }

            }else{
                $(".loadings").remove();
            }

        }
        setTimeout(function(){p=t},0)
    });
};
$(function(){
    // get_activityEvaluate(sectionCode,10);
    evaluateScrollEvent(10,1);
    $('.warp_gl_w_sp li').click(function(){
        var val = $(this).val();
        $(this).addClass("thisclass").siblings().removeClass("thisclass");
        if(val==10){
            $('.warp_gl_w_so0').show();
            $('.warp_gl_w_so1').hide();
            // get_activityEvaluate(sectionCode,10);
            evaluateScrollEvent(10,1);
        }else if(val==20){
            $('.warp_gl_w_so0').show();
            $('.warp_gl_w_so1').hide();
            // get_activityEvaluate(sectionCode,20);
            evaluateScrollEvent(20,1);
        }else if(val==30){
            $('.warp_gl_w_so0').hide();
            $('.warp_gl_w_so1').show();
            // get_needEvaluate(sectionCode, "全部岗位", null);
            evaluateScrollEvent(30,2)
        }
    });
    $(".warp_gl_w_sl_1 a").live("click",function(){
        $("input[name='id']").val($(this).parent().attr('val-id'));
        $("input[name='ticketCode']").val($(this).parent().attr('val-ticketCode'));
        $("input[name='star']").val($(this).parent().attr('val-star'));
        $("input[name='imgs']").val($(this).parent().attr('val-imgs'));
        var type = $(this).parent().attr('var-type');
        if(type==20){//管理员修改
            $("#content").val($(this).parent().attr('val-content'));
            $("#evaluateA").attr("onclick", "updateEvaluate();");
            $("#evaluateA").html("修改");
        }else if(type==10){//回复
            $("#content").val("");
            $("#evaluateA").attr("onclick", "replyEvaluate();");
            $("#evaluateA").html("回复");
        }
        $(".warp_gl_w_sf").fadeIn();
    });
    $(".warp_gl_w_sm a").live("click",function(){
        $("#content").val("");
        $(".warp_gl_w_sf").fadeOut();
    });

    $(".exc1 a").touchTouch();
    $(".exc2 .list").each(function(){
        $(this).find("a").touchTouch();
    });
    //删除
    $(".warp_gl_w_sl_2 a").live("click",function(){
        var id = $(this).attr('data-id');
        var data = {"id":id};
        console.log(id);
        layer.open({
            content: '您确定要这么做么？'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type:"post",
                    url:base_url + "html5/v1/activityEvaluate/delByAdmin",
                    data:JSON.stringify(data),
                    headers : {'token':token},
                    dataType:'json',
                    contentType: "application/json;charset=utf-8",
                    success:function(data){
                        if(data.code==0){
                            layer.open({content: '删除成功',skin: 'msg',time: 1});
                            setTimeout(function(){location.reload();},1000);
                        }else{
                            layer.open({
                                content: '网络错误'
                                ,skin: 'msg'
                                ,time: 1 //2秒后自动关闭
                            });
                            return false;
                        }
                    },
                    error:function(e){
                        layer.open({
                            content: '网络错误'
                            ,skin: 'msg'
                            ,time: 1 //2秒后自动关闭
                        });
                        return false;
                    }
                })
                layer.close(index);
            }
        })
    })
});

function findBySectionCode(){
    //$(".warp_gl_w_sb span").live("click",function(){
    var data = {"sectionCode":sectionCode, "user": user_msg.userId};
    var name = "岗位", url = base_url + "html5/v1/recruit/findBySectionCode";
    if($('.warp_gl_w_sn').attr("data-id")=="20"){
        name = "任务", url = base_url + "html5/v1/task/queryBySectionCode";
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: url,
        data: JSON.stringify(data),
        headers: {'token': token},
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data1 = data.data;
                var html = '<li data-name="全部'+name+'" data-id="" onclick="warp_gl_y_slLiClick(this);"><a href="#">全部'+name+'</a></li>';
                $.each(data1, function (index, val) {
                    html += '<li data-name="'+val.name+'" data-id="'+val.ticketOrder+'" onclick="warp_gl_y_slLiClick(this);"><a href="#">'+val.name+'</a></li>';
                })
                $(".warp_gl_y_sl").html(html);
            }
        }
    })
    $(".warp_gl_y_sw").fadeIn();
}
function warp_gl_y_slLiClick(obj){
    var data_id = $(obj).attr("data-id");
    if(data_id==""){
        data_id = null;
    }
    // get_needEvaluate(sectionCode, $(obj).attr("data-name"), data_id);
    evaluateScrollEvent(30,2,data_id)
    $(obj).addClass("thisclass").siblings().removeClass("thisclass");
    $(".warp_gl_y_sw").fadeOut();
}
function get_needEvaluate(sectionCode, recruitName, ticketOrder,page,size,status) {
    var html = '';//, "ticketOrder":""
    var data = {"pageNumber": page, "pageSize": size, "sectionCode": sectionCode ,"evaluate": 20, "type": $('.warp_gl_w_sn').attr("data-id"), "ticketOrder":ticketOrder}
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "post",
        url: base_url + "html5/v1/activityEvaluate/selectNeedEvaluate",
        data: JSON.stringify(data),
        headers: {'token': token},
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        beforeSend: function (XMLHttpRequest) {
            // $(".warp_gl_w_sv").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
        },
        success: function (data) {
            if (data.code == 0) {
                if(status==1){
                    $(".warp_gl_w_sv").empty();
                }
                var data1 = data.data.records;
                if(data1.length>0){
                    $(".warp_gl_w_sb span").html(recruitName+"（待评价"+data1.length+")");
                    $.each(data1, function (index, val) {
                        html += '<li>\
                                <a href="#">\
                                    <b onclick="fadeInEvaluate(\''+val.ticket+'\');">评价</b>';

                        if(val.headImg==''){
                            html += '<img src="../wap/img/pws_244.png" >';
                        }else{
                            html += '<img src="'+val.headImg+'" >';
                        }
                        html += '<span>'+val.nickName+'</span>\
                                </a>\
                            </li>'
                    })
                    $(".loadings").remove();
                    $(".warp_gl_w_sv").append(html);
                }else {
                    if($(".lastNothing").length>0){
                        $(".lastNothing").remove();
                    }
                    $(".loadings").remove();
                    if($(".loadings").length<=0){
                        $(".warp_gl_w_si").append('<div class="lastNothing" style="font-size:14px;line-height:50px;text-align:center;color:#666;">没有了</div>');
                    }
                }

            }
        }
    });
}
function fadeInEvaluate(ticket){
    window.location.href = '../order/admin_evaluate.html?ticket='+ticket+"&org=0";
}

function updateEvaluate(){
    var id = parseInt($("input[name='id']").val());
    var ticketCode = $("input[name='ticketCode']").val();
    var star = $("input[name='star']").val();
    var imgs = $("input[name='imgs']").val();
    var content = $.trim($("#content").val());
    var str = JSON.stringify({"id":id,"ticketCode":ticketCode,"star":parseInt(star),"imgs":imgs,"content":content,"prjvUserId":user_msg.userId});
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/activityEvaluate/updateActivityEvaluate",
        data:str,
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                layer.open({
                    content: '修改成功'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                setTimeout(function(){location.reload();},1000);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }

        },
        error:function(e){
            layer.open({
                content: '网络错误'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}

function replyEvaluate(){
    var id = parseInt($("input[name='id']").val());
    var content = $.trim($("#content").val());
    var str = JSON.stringify({"activityEvaluateId":id,"prjvUserId":prjvorgMsg.prjvUserId,"prjvUserName":"","nickName":prjvorgMsg.name,"headImg":prjvorgMsg.logo,"content":content,"type":10});
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type:"post",
        url:base_url + "html5/v1/activityEvaluate/saveReply",
        data:str,
        headers : {'token':token},
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        success:function(data){
            if(data.code==0){
                layer.open({
                    content: '回复成功'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
                $("#huifu").fadeOut();
                //setTimeout(function(){window.location.href ='./evaluate_list.html'},1000);
            }else{
                layer.open({
                    content: data.msg
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                });
            }

        },
        error:function(e){
            layer.open({
                content: '网络错误'
                ,skin: 'msg'
                ,time: 1 //2秒后自动关闭
            });
            return false;
        }
    })
}

