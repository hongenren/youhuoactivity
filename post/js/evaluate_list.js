var pkUnitCodeZ = "", pkUnitCodeList = {}, year = "", months = [], minMonth = 0, dayListStr = "";
function getList(pkPostCode){
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: 'post',
        url: base_url + "/html5/v1/station/postApply/queryDayList",
        data: JSON.stringify({"pkPostCode": pkPostCode}),
        dataType: 'json',
        headers: {'token': token},
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                var data_index = data.data;
                $.each(data_index, function (k, val) {
                    var date = new Date(val.day);
                    var nowYear = date.getFullYear();
                    var nowMonth = date.getMonth() + 1;
                    var nowDay = date.getDate();

                    if(minMonth==0){
                        minMonth = nowMonth;
                    }else{
                        if(nowMonth<minMonth){
                            minMonth = nowMonth;
                        }
                    }
                    months.push(nowMonth);
                    year = nowYear;
                    dayListStr += nowYear+"-"+nowMonth+"-"+nowDay+",";
                    pkUnitCodeList[nowYear+"-"+nowMonth+"-"+nowDay] = val.code;
                    if(k<5){
                        if(k==0){
                            var html ='<div class="succeed-list-title-div pitch-on" onclick="passListChoose(this, \''+val.code+'\', '+type+', 1, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                    </div>\
                                 </div>';
                            pkUnitCodeZ = val.code;
                            get_evaluate_list(1, 20);
                        }else{
                            var html ='<div class="succeed-list-title-div" onclick="passListChoose(this, \''+val.code+'\', '+type+', 1, 20);">\
                                    <div>\
                                        <span>'+getDate(0, val.day)+'</span>\
                                        <span>'+getDate(1, val.day)+'</span>\
                                    </div>\
                                 </div>';
                        }
                    }
                    /*<span>'+val.failUserList.length+'人</span>\*/
                    $(".succeed-list-title").append(html);
                })
                $(".succeed-list-title").append('<div class=\"succeed-list-title-div\" onclick="openDate();">\
                                                     <div style=\"border: 0px\">\
                                                        <img src="../wap/img/calendar.jpg">\
                                                     </div>\
                                                 </div>');
            }
        }
    })
}
function openDate(){
    if($(".select_div").html().trim()==""){
        $('.warp_gl_w').hide();
        $('.select-time').click();
        $.each(months, function (k, val) {
            $("#months_"+val).show();
        })
    }else{
        $('.warp_gl_w').show();
        closeData();
    }
}
function passListChoose(obj, pkUnitCode, type, pageNumber, pageSize){
    $('.succeed-list-title-div').removeClass('pitch-on');
    $(obj).addClass('pitch-on');
    $('.warp_gl_w').show();
    closeData();
    pkUnitCodeZ = pkUnitCode;
    get_evaluate_list(pageNumber, pageSize);
}
//管理员的评论 和自己的评论
    function get_evaluate_list(pageNumber, pageSize){
        var json = JSON.stringify({"pageNumber":pageNumber,"pageSize": pageSize,"pkUnitCode":pkUnitCodeZ,"type": type});
        $(".succeed-list").show();
        if($_GET['taskType']!==null){
            $(".succeed-list").hide();
            json = JSON.stringify({"pageNumber":pageNumber,"pageSize": pageSize,"pkUnitCode":$_GET['pkPostCode'],"type": type});
        }
        $.ajax({
            xhrFields: {
               withCredentials: true
            },
            type:"post",
            url:base_url + "html5/v1/station/postEvaluate/selectByUnitPostAndType",
            data:json,
            headers : {'token':token},
            dataType:'json',
            contentType: "application/json;charset=utf-8",
            beforeSend:function(XMLHttpRequest){
                $(".warp_gl_w_si").html("<img src='../wap/img/loading.gif' style='width:24px;heigth:24px; margin:0 auto;display:block'/>");
            },
            success:function(data){
                if(data.code==0){
                    var data1 = data.data.records;
                    if(data1){
                        evaluate_html(data1,type);
                    }else{
                        $(".noneLi").hide();
                        $(".warp_gl_w_si").html(
                            "<li class='noneLi' style='background: #F2F2F2;'>\
                                <a href='javascript:void(0)'>\
                                <h3 style='text-align: center;'>已经没有更多啦。。。</h3>\
                                </a>\
                            </li>");
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
// 评价信息加载 html
    function evaluate_html(data,type){
        var html = '';
        $.each(data,function(index,val){
            html += ' <li class="warp_gl_w_su">\
                                    <div class="warp_gl_w_sy">';
                        var img = "", morenimg = "", name = ""
                        if(type==10){
                            img = val.headImg;
                            morenimg = "../wap/img/pws_244.png";
                            name = val.nickName;
                        }else{
                            img = val.orgImges;
                            morenimg = "../wap/img/jg_tp_4.png";
                            name = val.orgName;
                        }
                        if(img==null || img==undefined || img==""){
                            html += '<img src="'+morenimg+'" style="background-color: #72B81E;" class="warp_gl_w_sy_ig">';
                        }else{
                            html += '<img src="'+img+'" class="warp_gl_w_sy_ig">';
                        }
                            html +=     '<div class="warp_gl_w_st">\
                                            <div class="warp_gl_w_sr">\
                                                <i>'+val.createTime+'</i>';
                        if(name==null || name==undefined || name==""){
                            html += '<span></span>';
                        }
                            html += '<span>'+name+'</span>';
                        if(type==20 && val.passiveUserName!=""){
                            html += '<br /><span>对'+val.passiveUserName+'的评价</span>';
                        }
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
                                    html += '<li style="width: 30%;"><a href="javascript:void(0)"><img name="evaluateImgs" style="" src="'+imgs[i]+'"></a></li>';
                                }
                            };
                        }
                            html +=     '</ul>\
                                        </div>\
                                    </div>\
                                    <div class="warp_gl_w_sq">\
                                        <span>来自【'+val.postName+'】评价</span>\
                                    </div>\
                                    <ul class="warp_gl_w_sl">';
                            if(type==10){
                                html +=    '<li class="warp_gl_w_sl_3" val-user="'+val.prjvUserId+'" val-star="'+val.star+'" val-imgs="'+val.imgs+'" val-id="'+val.id+'" val-content="'+val.content+'">\
                                                <a href="javascript:void(0)"><img src="../wap/img/pws_271.png">回复</a>\
                                            </li>\
                                            <li class="warp_gl_w_sl_2">\
                                                    <a href="javascript:void(0)" data-id="'+val.id+'"><img src="../wap/img/pws_272.png">删除</a>\
                                            </li>';
                            }else{
                                html +=    '<li class="warp_gl_w_sl_1" val-user="'+val.prjvUserId+'" val-star="'+val.star+'" val-imgs="'+val.imgs+'" val-id="'+val.id+'" val-content="'+val.content+'">\
                                                <a href="javascript:void(0)"><img src="../wap/img/pws_271.png">修改评价</a>\
                                            </li>\
                                            <li class="warp_gl_w_sl_2">\
                                                    <a href="javascript:void(0)" data-id="'+val.id+'"><img src="../wap/img/pws_272.png">删除</a>\
                                            </li>';
                            }
                        var replyList = val.replyList;
                        for (var i = 0; i < replyList.length; i++) {
                            if(replyList[i].headImg==null || replyList[i].headImg==undefined || replyList[i].headImg==""){
                                if(type==10){
                                    replyList[i].headImg = "<img src=\"../wap/img/pws_244.png\">";
                                }else{
                                    replyList[i].headImg = "<img src=\"../wap/img/jg_tp_4.png\" style=\"background-color: #72B81E;\">";
                                }
                            }else{
                                replyList[i].headImg = "<img src=\""+replyList[i].headImg+"\">";
                            }
                            html +=   '<div class="warp_gl_w_sk">\
                                                                '+replyList[i].headImg+'\
                                                                <div class="warp_gl_w_sj">\
                                                                    <div class="warp_gl_w_sh">\
                                                                        <i>'+replyList[i].createTime+'</i>\
                                                                        <span>'+replyList[i].nickName+'</span>\
                                                                    </div>\
                                                                    <div class="warp_gl_w_sg">\
                                                                        <span>'+replyList[i].content+'</span>\
                                                                    </div>\
                                                                </div>\
                                                            </div>';
                        }
                        html +=   '</ul></li>';
        })
        $(".warp_gl_w_si").empty(html);
        $(".warp_gl_w_si").append(html);
        $("img[name='evaluateImgs']").each(function(i){
            $(this).height($(this).width());
            $(this).attr("src", $(this).attr("src")+"?x-oss-process=image/resize,m_pad,h_"+$(this).width()+",w_"+$(this).width()+",color_FFFFFF");
        })
    }
    $(function(){
        get_evaluate_list( 1, 20);
        $('.warp_gl_w_sp li').click(function(){
            var val = $(this).val();
            $('.warp_gl_w_so').hide();
            $('.warp_gl_w_so').eq($(this).index()).show();
            $(this).addClass("thisclass").siblings().removeClass("thisclass");
            type = val;
            get_evaluate_list( 1, 20);
            /*if(val==10){
                type = val;
                get_evaluate_list(1,20,type);
            }else if(val==20){
                type = val;
                get_evaluate_list(1,20,type);
            }else{

            }*/
        });
        $(".warp_gl_w_sl_1 a").live("click",function(){
            //console.log($(this).parent().attr('val-id'));
            $("input[name='id']").val($(this).parent().attr('val-id'));
            $("input[name='prjvUser']").val($(this).parent().attr('val-user'));
            $("input[name='star']").val($(this).parent().attr('val-star'));
            $("input[name='imgs']").val($(this).parent().attr('val-imgs'));
            $("#content").val($(this).parent().attr('val-content'));
            $("#xiugai").fadeIn();
        });
        $(".chance").live("click",function(){
            $("#xiugai").fadeOut();
            $("#huifu").fadeOut();
        })
        $(".sub").live("click",function(){
            var id = parseInt($("input[name='id']").val());
            var userId = $("input[name='prjvUser']").val();
            var star = $("input[name='star']").val();
            var imgs = $("input[name='imgs']").val();
            var content = $.trim($("#content").val());
            var str = JSON.stringify({"id":id,"star":parseInt(star),"imgs":imgs,"content":content,"prjvUserId":userId});
            $.ajax({
                    xhrFields: {
                       withCredentials: true
                    },
                    type:"post",
                    url:base_url + "html5/v1/station/postEvaluate/updatePostEvaluate",
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
                            setTimeout(function(){window.location.reload();},1000);
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
        })
        $(".subhuifu").live("click",function(){
            var id = parseInt($("input[name='id']").val());
            var content = $.trim($("#contenthuifu").val());
            var str = JSON.stringify({"postEvaluateId":id,"prjvUserId":prjvorgMsg.prjvOrgId,"nickName":prjvorgMsg.orgThirdAccountName,"headImg":prjvorgMsg.logo,"type":20,"content":content});
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type:"post",
                url:base_url + "html5/v1/station/postEvaluate/saveReply",
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
        })
        // $(".warp_gl_w_sm a").live("click",function(){
        //     $(".warp_gl_w_sf").fadeOut();
        // });
        $(".warp_gl_w_sb span").live("click",function(){
            $(".warp_gl_y_sw").fadeIn();
        });
        $(".warp_gl_y_sl li").live("click",function(){
             $(this).addClass("thisclass").siblings().removeClass("thisclass");
            $(".warp_gl_y_sw").fadeOut();
        });

        $(".exc1 a").touchTouch();
        $(".exc2 .list").each(function(){
            $(this).find("a").touchTouch();
        });
        //删除
        $(".warp_gl_w_sl_2 a").live("click",function(){
            var id = $(this).attr('data-id');
            var data = {"id":id};
            var url = "html5/v1/station/postEvaluate/delByAdmin";
            if(type==20){
                data.prjvUserId = user_msg.userId;
                data.type = 20;
                url = "html5/v1/station/postEvaluate/delBySelf";
            }
            layer.open({
            content: '您确定要这么做么？'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    $.ajax({
                        xhrFields: {
                           withCredentials: true
                        },
                        type:"post",
                        url:base_url + url,
                        data:JSON.stringify(data),
                        headers : {'token':token},
                        dataType:'json',
                        contentType: "application/json;charset=utf-8",
                        success:function(data){
                            if(data.code==0){
                                layer.open({content: '删除成功',skin: 'msg',time: 1});
                                //setTimeout(function(){location.reload();},1000);
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
        //回复
        $(".warp_gl_w_sl_3 a").live("click",function(){
            //console.log($(this).parent().attr('val-id'));
            $("input[name='id']").val($(this).parent().attr('val-id'));
            $(".subhuifu").fadeIn();
            $("#huifu").fadeIn();
        });
    });

function getDate(type, day){
    var date = new Date(day.replace(/\-/g,'/'));
    var Y = date.getFullYear().toString();
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    var D = (date.getDate()< 10? '0' + date.getDate():date.getDate());
    if(type==0){
        return M + '-' + D;
    }else{
        var today = new Array('周日','周一','周二','周三','周四','周五','周六');
        var week = today[date.getDay()];
        return week;
    }
}
